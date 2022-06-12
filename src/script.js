/**
 * Структура объекта тега:
 * {
 *  readOnly: false,
 *  text: '',
 *  id: num
 * }
 */

class Tag{
    constructor(obj){
        this.obj = obj;
    }

    set text(text){
        if(this.obj.readOnly) return;
        this.obj.text = text;
    }

    get text(){
        return this.obj.text;
    }

    set readOnly(bool){
        if(this.obj.readOnly) return;
        this.obj.readOnly = bool;
    }

    get readOnly(){
        return this.obj.readOnly;
    }

    set id(id){
        this.id = id;
    }

    get id(){
        return this.id;
    }

    show(){
        return this.obj;
    }
}

class Tags{
    constructor(){
        this.tags = [];
    }

    add(data){
        if (data.text.length > 0){
            let id = this.getId();

            data.id = id;

            let tag = new Tag(data);
            this.tags.push(tag);
        }
    }

    getId(){
        let noteId = Math.floor(Math.random() * 100);
        if(this.tags) return noteId;
        if (this.tags.some(data => data.id === noteId)){
            this.getId()
        }else{
            return noteId
        }
    }

    removeTag(id){
        this.tags = this.tags.filter(item => item.obj.id !== id);
    }

    getTags(){
        return this.tags;
    }

    setReadOnly(id){
        this.tags.forEach(item => {
            if (item.obj.id === id){
                item.obj.readOnly = !item.obj.readOnly;
            }
        })
    }
}

// let tags = new Tags()

// tags.add({
//     text: 'text',
//     readOnly: true
// })

// console.log(tags.getTags())

class TagsUi extends Tags{
    constructor(entryPoint){
        super();
        this.entryPoint = document.querySelector(entryPoint);
        this.init();
    }

    init(){
        if (this.storage) {
            let storageList = this.storage;
            storageList.forEach(item => this.add(item.obj));
        }

        let form = document.createElement('form');
        form.setAttribute('class', 'tags_form');

        let inputTags = document.createElement('input');
        inputTags.setAttribute('type', 'text');
        inputTags.setAttribute('placeholder', 'Add tag');

        let readOnlyCheck = document.createElement('input');
        readOnlyCheck.setAttribute('type', 'checkbox');

        let addButton = document.createElement('button');
        addButton.setAttribute('type', 'submith');
        addButton.innerText = 'Add Tag';

        form.addEventListener('submit', e => this.addTag(e, inputTags, readOnlyCheck))

        form.append(inputTags, readOnlyCheck, addButton);

        this.tagList = document.createElement('div');
        this.tagList.classList.add('tag_list');

        this.tagListRender();

        this.entryPoint.append(form, this.tagList);
    }

    tagListRender(){
        this.tagList.innerHTML = '';

        this.tags.forEach(item => {
            let tag = document.createElement('div');
            tag.classList.add('tag');

            let tagText = document.createElement('span')
            tagText.innerText = item.text;

            let buttonDel = document.createElement('button');
            buttonDel.classList.add('button_del');
            buttonDel.innerHTML = '&#10006;';
            buttonDel.disabled = item.readOnly;
            buttonDel.addEventListener('click', () => {
                this.removeTag(item.obj.id);
                this.storage = this.tags;
                this.tagListRender();
            });

            tag.append(tagText, buttonDel);

            this.tagList.append(tag);
        })
    }

    addTag(e, input, check){
        e.preventDefault();
        let tag = {text: input.value, readOnly: check.checked}
        input.value = '';
        check.checked = false;
        this.add(tag);
        this.tagListRender();
        this.storage = this.tags;
    }

    get storage(){
        return JSON.parse(localStorage.getItem('tagList'));
    }

    set storage(data){
        localStorage.setItem('tagList', JSON.stringify(data));
    }
}

new TagsUi('#root')