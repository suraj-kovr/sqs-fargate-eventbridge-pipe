import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Cluster, ContainerImage, FargateTaskDefinition, LogDriver } from "aws-cdk-lib/aws-ecs";
import { CfnPipe } from "aws-cdk-lib/aws-pipes";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { JsonPath } from "aws-cdk-lib/aws-stepfunctions";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { CfnOutput } from "aws-cdk-lib";

export class AppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const env = 'dev';
        const constants = appConstants[env];

        const vpc = Vpc.fromLookup(this, 'vpc', {
            isDefault: true
        });

        const ecsCluster = new Cluster(this, "ecsCluster", {
            clusterName: "ds-cluster",
            enableFargateCapacityProviders: true,
            vpc: vpc
        });

        const fargateTaskDefinition = new FargateTaskDefinition(this, 'fargateTaskDefinition', {
            memoryLimitMiB: 512,
            cpu: 256,
        });

        fargateTaskDefinition.addContainer('defaultContainer', {
            image: ContainerImage.fromRegistry(constants.IMAGE_ARN),
            logging: LogDriver.awsLogs({
                streamPrefix: '/app/',
                logRetention: RetentionDays.ONE_DAY
            })
        });

        const pipeRole = new Role(this, 'dsEventBridgeIAMRole', {
            roleName: 'ds-event-bridge-iam-role',
            description: 'IAM Role for EventBridge Pipe',
            assumedBy: new ServicePrincipal('pipes.amazonaws.com')
        });

        fargateTaskDefinition.grantRun(pipeRole)

        for (const queueDetails of constants.QUEUES) {
            const queue = Queue.fromQueueArn(this, 'sqsQueue', queueDetails.QUEUE_ARN);
            queue.grantConsumeMessages(pipeRole)
            const cfnPipe = new CfnPipe(this, 'dsEventBridgePipe', {
                name: `ds-sqs-pipe-${queue.queueName}`,
                description: 'Eventbridge Pipe to invoke ECS',
                roleArn: pipeRole.roleArn,
                source: queue.queueArn,
                target: ecsCluster.clusterArn,
                sourceParameters: {
                    sqsQueueParameters: {
                        batchSize: 1,
                        maximumBatchingWindowInSeconds: 120
                    },
                },
                targetParameters: {
                    ecsTaskParameters: {
                        capacityProviderStrategy: [{
                            capacityProvider: 'FARGATE_SPOT',
                            base: 1
                        }],
                        taskDefinitionArn: fargateTaskDefinition.taskDefinitionArn,
                        taskCount: 1,
                        networkConfiguration: {
                            awsvpcConfiguration: {
                                subnets: vpc.selectSubnets({
                                    subnetType: SubnetType.PUBLIC
                                }).subnets.map(subnet => subnet.subnetId),
                                assignPublicIp: 'ENABLED'
                            },
                        },
                        overrides: {
                            containerOverrides: [
                                {
                                    name: fargateTaskDefinition.defaultContainer?.containerName,
                                    command: ["python", "-m", "ssp_pipeline.main"],
                                    environment: [
                                        {
                                            name: 'PIPELINE',
                                            value: queueDetails.PIPELINE_NAME
                                        },
                                        {
                                            name: 'PAYLOAD',
                                            value: JsonPath.stringAt('$.body')
                                        }
                                    ]
                                },
                            ],
                            ephemeralStorage: {
                                sizeInGiB: 21
                            },
                        }
                    }
                },
            });

            new CfnOutput(this, 'sqsQueueOutput', {
                description: 'SQS Queue Url',
                value: queue.queueUrl
            })

            new CfnOutput(this, 'eventbridgePipeOutput', {
                description: 'EventBridge Pipe',
                value: cfnPipe.name!
            })
        }
    }
}
