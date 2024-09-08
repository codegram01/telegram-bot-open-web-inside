export default async (query) => {
    const resDuck = await fetch("https://lite.duckduckgo.com/lite/", {
        "method": "POST",
        "body": `q=${query}&kl=&df`,
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:127.0) Gecko/20100101 Firefox/127.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded",
            "Sec-GPC": "1",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Priority": "u=1",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        cf: {
            cacheTtl: 12000,
            cacheEverything: true,
        }
    });

    const links = []
    const titles = []
    class LinkHandler {
      element(element) {
        if(element.hasAttribute("href")) {
          const link = element.getAttribute("href")
          links.push(link)
        }
      }
      text(text) {
        if(text.text) {
          titles.push(text.text)
        }
      }
    }

    const rewriter = new HTMLRewriter()
    .on(".result-link", new LinkHandler())

    await rewriter.transform(resDuck).text();

    return {
        links,
        titles
    }
}