using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
namespace PersonalBlog.Controllers.LiveDataController;

[ApiController]
[Route("api/live")]
public class LiveDataController : ControllerBase
{
    readonly HttpClient client;
    readonly HttpRequestMessage request;
    public LiveDataController()
    {
        client = new HttpClient();
        request = new HttpRequestMessage(HttpMethod.Get, "https://api.live.bilibili.com/xlive/web-room/v1/dM/gethistory?roomid=8604981&room_type=0");
    }

    [HttpGet("live/8604981/0")]
    public async Task<ActionResult> GetLiveData()
    {
        request.Headers.Add("accept", "application/json, text/plain, */*");
        request.Headers.Add("accept-language", "en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6");
        request.Headers.Add("cookie", "buvid4=87BCF094-4D52-47BE-6A77-66BFF094612526041-022012117-a2WKZwKEHgPJH8LOOTTfXg%3D%3D; i-wanna-go-back=-1; buvid_fp_plain=undefined; hit-new-style-dyn=1; FEED_LIVE_VERSION=V8; enable_web_push=DISABLE; _uuid=C8D9EBDA-6AE9-1CDB-10577-48E7DCEE793B82262infoc; hit-dyn-v2=1; buvid3=745EC9B5-DD00-592E-B99C-9AB53BC648E218195infoc; b_nut=1711091818; b_ut=5; rpdid=|(umRu~kl)|~0J'u~uu|mu)Rm; header_theme_version=CLOSE; LIVE_BUVID=AUTO2617112665028108; Hm_lvt_8a6e55dbd2870f0f5bc9194cddf32a02=1720612546; balh_server_inner=__custom__; balh_is_closed=; CURRENT_FNVAL=4048; DedeUserID=90501651; DedeUserID__ckMd5=1e2b438e9a8500a9; home_feed_column=5; browser_resolution=1536-703; fingerprint=870295497135134fd4bdc2a70b24c9ec; SESSDATA=e0e787f8%2C1739373279%2Cb1d3a%2A82CjDv2p8yN3sefLDEcUEGK9uM7hjZepjSqHMbidM3P4NZoyU0hxLxdX94nBZjlORQyasSVkRYbldZZ0hRbTBqOTh6R0hZSlFpVDM0SFN3ckdBNHFOT3NEQWdkdk9Ldmkyd1ZSVUM0ODQxUjNnaE5SeUxHSGVNUWtCblVrNkZkN0hGU3FpRDdvblRBIIEC; bili_jct=2882bbe47c99978e2553db23bb2aaab7; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjQwODA0ODgsImlhdCI6MTcyMzgyMTIyOCwicGx0IjotMX0.HYh7AHrTURcOMV_QeRcTfizhJByjrecc2bGa41eknqg; bili_ticket_expires=1724080428; CURRENT_QUALITY=80; sid=6svck15f; buvid_fp=870295497135134fd4bdc2a70b24c9ec; bp_t_offset_90501651=967041741012074496; b_lsid=E1FD481C_19166540EAF; CURRENT_BLACKGAP=1; PVID=12");
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


        try
        {
            HttpResponseMessage response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();
            return Ok(responseBody);
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
        
    }
}
