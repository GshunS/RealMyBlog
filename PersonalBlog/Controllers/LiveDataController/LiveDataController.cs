using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace PersonalBlog.Controllers.LiveDataController;

[ApiController]
[Route("api/live")]
public class LiveDataController : ControllerBase
{
    readonly HttpClient client;
    public LiveDataController()
    {
        client = new HttpClient();
    }

    private HttpRequestMessage CreateRequest(HttpMethod method, string url)
    {
        var request = new HttpRequestMessage(method, url);

        // Common headers
        request.Headers.Add("accept", "application/json, text/plain, */*");
        request.Headers.Add("accept-language", "en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6");
        request.Headers.Add("cookie", "buvid4=87BCF094-4D52-47BE-6A77-66BFF094612526041-022012117-a2WKZwKEHgPJH8LOOTTfXg%3D%3D; ...");
        request.Headers.Add("dnt", "1");
        request.Headers.Add("origin", "https://live.bilibili.com");
        request.Headers.Add("priority", "u=1, i");
        request.Headers.Add("referer", "https://live.bilibili.com/blanc/8604981?liteVersion=true&live_from=62001&plat=flash");
        request.Headers.Add("sec-ch-ua", "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"");
        request.Headers.Add("sec-ch-ua-mobile", "?0");
        request.Headers.Add("sec-ch-ua-platform", "\"Windows\"");
        request.Headers.Add("sec-fetch-dest", "empty");
        request.Headers.Add("sec-fetch-mode", "cors");
        request.Headers.Add("sec-fetch-site", "same-site");
        request.Headers.Add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36");

        return request;
    }

    [HttpGet("live/8604981/0")]
    public async Task<ActionResult> GetLiveData()
    {
        string url = "https://api.live.bilibili.com/xlive/web-room/v1/dM/gethistory?roomid=8604981&room_type=0";
        try
        {
            var request = this.CreateRequest(HttpMethod.Get, url);
            HttpResponseMessage response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();

            // 解析原始响应
            using JsonDocument document = JsonDocument.Parse(responseBody);
            var root = document.RootElement;
            var roomData = root.GetProperty("data").GetProperty("room");

            // 提取我们需要的字段
            var messages = roomData.EnumerateArray().Select(item => new
            {
                text = item.GetProperty("text").GetString(),
                timeline = item.GetProperty("timeline").GetString(),
                nickname = item.GetProperty("nickname").GetString(),
                medal_name = item.TryGetProperty("medal", out var medal) && medal.GetArrayLength() > 1 
                    ? medal[1].GetString() 
                    : null,
                medal_level = item.TryGetProperty("medal", out var medalLevel) && medalLevel.GetArrayLength() > 0 
                    ? medalLevel[0].GetInt32() 
                    : 0,
                uid = item.GetProperty("uid").GetInt64()
            }).ToList();

            return Ok(new { code = 0, data = messages });
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

    [HttpGet("liveStream/8604981")]
    public async Task<ActionResult> GetStreamAddr()
    {
        string updatedUrl = "https://api.live.bilibili.com/room/v1/Room/playUrl?quality=4&cid=8604981";
        try
        {
            var request = this.CreateRequest(HttpMethod.Get, updatedUrl);
            HttpResponseMessage response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();

            // 解析原始响应
            using JsonDocument document = JsonDocument.Parse(responseBody);
            var root = document.RootElement;
            var data = root.GetProperty("data");
            var durls = data.GetProperty("durl");
            var streamUrl = durls.EnumerateArray().First().GetProperty("url").GetString();

            return Ok(new { code = 0, data = new { url = streamUrl } });
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }
}
