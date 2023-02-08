class Contenedor {
    constructor(mongoDB, messageModel) {
        this.mongoDB = mongoDB;
        this.messageModel = messageModel;
    }

    async save(message) {
        try {
         
            const newMessage = new this.messageModel(message);

            console.log('estoy desde MongoDB');

            this.mongoDB
                .then(_ => newMessage.save())
                .catch(err => console.log(`Error: ${err.message}`));

        } catch (error) {
            throw Error(`Error en save`);
        }
    }

    async getAll() {
        try {
            let docs = false;
            docs = await this.messageModel.find();
            if (docs) {
                return docs;
            } else {
                return false;
            }
        } catch (error) {
            throw Error(`Error en getAll`);
        }
    }
}

module.exports = Contenedor;