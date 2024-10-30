using System.IO;
using System.Security.Cryptography;

namespace PersonalBlog.MyUtils.MyEncrypt;

public class FileMD5Helper
{
    public static string CalculateFileMD5(IFormFile file)
    {
        using (var md5 = MD5.Create())
        {
            using (var stream = file.OpenReadStream())
            {
                var hashBytes = md5.ComputeHash(stream);
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
            }
        }
    }
}
