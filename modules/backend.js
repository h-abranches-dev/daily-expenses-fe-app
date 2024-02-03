class Server {
    constructor(protocol, host, port) {
        this.protocol = protocol;
        this.host = host;
        this.port = port;
        this.address = `${this.protocol}://${this.host}:${this.port}`;
    }
}

const server = new Server("http", "localhost", 8080);

export { server };