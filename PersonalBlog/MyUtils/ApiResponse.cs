namespace PersonalBlog.MyUtils;

public class ApiResponse<T>
{

    public int StatusCode { get; set; }


    public string Message { get; set; }


    public T? Data { get; set; }

    public ApiResponse(int statusCode, string message, T data)
    {
        StatusCode = statusCode;
        Message = message;
        Data = data;
    }

    public ApiResponse(int statusCode, string message)
    {
        StatusCode = statusCode;
        Message = message;
    }

    public static ApiResponse<T> Success(string message = "Success")
    {
        return new ApiResponse<T>(200, message);
    }

    public static ApiResponse<T> Success(T data, string message = "Success")
    {
        return new ApiResponse<T>(200, message, data);
    }

    public static ApiResponse<T> Error(int statusCode, string message)
    {
        return new ApiResponse<T>(statusCode, message, default!);
    }
}

