export default class Request {
    constructor () {
        this.url = "";
        this.body = "";
        this.header = "";
        this.method = "";
    }

    setURL(url) {
        this.url = url;
    }

    setMethod(method) {
        this.method = method;
    }

    setBody(body) {
        this.body = JSON.stringify(body);
    }

    setHeader(header) {
        this.header = header;
    }

    async send() {
        return await $.ajax({
            url: this.url,
            type: this.method,
            data: this.body,
            headers: this.header,
        });
    }
}