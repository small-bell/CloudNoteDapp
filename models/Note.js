class Note {

    constructor(userId, title, content) {
        this.userId = 0;
        this.title = '';
        this.content = '';
        this.address = '';
        if (arguments.length === 1) {
            this.userId = userId;
        } else if (arguments.length === 2) {
            this.userId = userId;
            this.title = title;
        } else if (arguments.length === 3) {
            this.userId = userId;
            this.title = title;
            this.content = content;
        }
    }

    // setter
    addUserId(_userId) {
        this.userId = _userId;
        return this;
    }
    addTitle(_title) {
        this.title = _title;
        return this;
    }
    addContent(_content) {
        this.content = _content;
        return this;
    }
    addAddress(_address) {
        this.address = _address;
        return this;
    }
}

module.exports = Note;
