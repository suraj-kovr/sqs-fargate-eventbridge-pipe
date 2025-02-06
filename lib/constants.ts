interface AppConstants {
    QUEUES: QueueDetails[];
    IMAGE_ARN: string;
}

interface QueueDetails {
    QUEUE_ARN: string;
    QUEUE_NAME: string;
    UPDATE_QUEUE_ARN: string;
    PIPELINE_NAME: string;
}

const appConstants: Record<string, AppConstants> = {
    "dev": {
        QUEUES: [
            {
                QUEUE_ARN: "arn:aws:sqs:us-west-2:296062557786:compliance-artifacts-queue",
                QUEUE_NAME: "compliance-artifacts-queue",
                UPDATE_QUEUE_ARN: "arn:aws:sqs:us-west-2:296062557786:compliance-artifacts-update-queue",
                PIPELINE_NAME: "compliance"
            }
        ],
        IMAGE_ARN: '296062557786.dkr.ecr.us-west-2.amazonaws.com/kovr:latest'
    },
    "qa": {
        QUEUES: [
            {
                QUEUE_ARN: "",
                QUEUE_NAME: "",
                UPDATE_QUEUE_ARN: "",
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
                UPDATE_QUEUE_ARN: "",
                PIPELINE_NAME: ""
            }
        ],
        IMAGE_ARN: ""
    }
}

export { appConstants };