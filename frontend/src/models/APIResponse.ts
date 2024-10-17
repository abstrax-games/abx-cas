type SuccessResponse<DataType> = {
    success: true;
    data: DataType;
};

type ErrorResponse = {
    success: false;
    message: string;
};

type APIResponse<DataType> = SuccessResponse<DataType> | ErrorResponse;

export default APIResponse;

