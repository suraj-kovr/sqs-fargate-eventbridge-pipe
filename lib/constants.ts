interface AppConstants {
    QUEUES: QueueDetails[];
    IMAGE_ARN: string;
}

interface QueueDetails {
    QUEUE_ARN: string;
    PIPELINE_NAME: string;
}

const appConstants: Record<string, AppConstants> = {
    "dev": {
        QUEUES: [
            {
                QUEUE_ARN: "arn:aws:sqs:us-west-2:296062557786:compliance-artifacts-queue",
                PIPELINE_NAME: "compliance"
            }
        ],
        IMAGE_ARN: '767397841522.dkr.ecr.ap-south-1.amazonaws.com/kovr'
    },
    "qa": {
        QUEUES: [
            {
                QUEUE_ARN: "",
                PIPELINE_NAME: ""
            }
        ],
        IMAGE_ARN: ""
    },
    "prod": {
        QUEUES: [
            {
                QUEUE_ARN: "",
                PIPELINE_NAME: ""
            }
        ],
        IMAGE_ARN: ""
    }
}