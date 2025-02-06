interface AppConstants {
    QUEUES: QueueDetails[];
    IMAGE_ARN: string;
}

interface QueueDetails {
    QUEUE_ARN: string;
    QUEUE_NAME: string;
    PIPELINE_NAME: string;
}

const appConstants: Record<string, AppConstants> = {
    "dev": {
        QUEUES: [
            {
                QUEUE_ARN: "arn:aws:sqs:us-west-2:296062557786:compliance-artifacts-queue",
                QUEUE_NAME: "compliance-artifacts-queue",
                PIPELINE_NAME: "compliance-artifacts-pipeline"
            }
        ],
        IMAGE_ARN: '296062557786.dkr.ecr.us-west-2.amazonaws.com/kovr:latest'
    },
    "qa": {
        QUEUES: [
            {
                QUEUE_ARN: "",
                QUEUE_NAME: "",
                PIPELINE_NAME: ""
            }
        ],
        IMAGE_ARN: ""
    },
    "prod": {
        QUEUES: [
            {
                QUEUE_ARN: "",
                QUEUE_NAME: "",
                PIPELINE_NAME: ""
            }
        ],
        IMAGE_ARN: ""
    }
}

export { appConstants };