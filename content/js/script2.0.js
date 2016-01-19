window.addEventListener('load', function() {
    var addButton = document.getElementsByClassName('addNewNote')[0];
    var notesBlock = document.getElementsByClassName('notes')[0];
    //for cookie

    if (localStorage.getItem("counter") > 0) {
        var counter_notes_id = localStorage.getItem("counter");
        var notes_id_array = [localStorage.getItem("notes_id_array")][0].split(",");
        for (var i = 0; i < notes_id_array.length; i++) {
            if (notes_id_array[i] == "") {
                notes_id_array.splice(i,1);
            }
        }
        console.log(notes_id_array);
    }
    else {
        var counter_notes_id = 0;
        var notes_id_array = [];
    }

    addButton.addEventListener('click', addNewNote);

    function addNewNote() {
        notesBlock.insertAdjacentHTML('beforeEnd', '<section class="note">' +
            '<header class="noteHeader">'+
            '<i class="fa fa-sticky-note icon"></i>'+
            '<i class="fa fa-trash deleteButton"></i>'+
            '</header>'+
            '<section class="noteBody">'+
            '<textarea name="noteTextarea" id="noteTextarea" cols="30" rows="10"></textarea>'+
            '</section>'+
            '</section>');

        //устанавливаем id новому стику
        var notes = document.getElementsByClassName('note');
        var newNote = notes[notes.length-1];
        newNote.setAttribute('id', ++counter_notes_id + "");
        var note_id = newNote.id; // --------
        notes_id_array.push(note_id);
        //console.log(notes_id_array);
        localStorage.setItem("notes_id_array", notes_id_array);
        localStorage.setItem("counter", counter_notes_id);


        //узнаем координаты нового стика
        var top = newNote.getBoundingClientRect().top;  // --------
        var left = newNote.getBoundingClientRect().left;  // --------

        //узнаем текст в textarea
        var textareaVal = newNote.children[1].children[0].value;

        setLocalStorage(note_id, top, left, textareaVal);


        var deleteButtons = document.getElementsByClassName('deleteButton');
        for (var i = 0; i < deleteButtons.length; ++i) {
            deleteButtons[i].addEventListener('click', deleteNote);
        }
        // :::::::::::: drug and drop :::::::::::::::::::::
        var noteHeader = document.getElementsByClassName('noteHeader');
        for (var i = 0; i < noteHeader.length; ++i) {
            noteHeader[i].addEventListener("mousedown", mouseDown);

        }

        var textareaElem = document.getElementsByTagName('textarea');
        for (var i = 0; i < textareaElem.length; ++i) {
            textareaElem[i].addEventListener("change", changeTxtAreaVal);
        }
        // ::::::::::::::::::::::::::::::::::::::::::::::::
    }

    //---------------------------------------------------------------------------------------------------------------
    function deleteNote() {
        var note_id = this.parentNode.parentNode.id;

        //var new_notes_id_array = notes_id_array[0].split(",");
        //if (new_notes_id_array.length > 1) {
        //    new_notes_id_array.splice(new_notes_id_array.indexOf(note_id),1);
        //    localStorage.removeItem("notes_id_array");
        //    localStorage.setItem("notes_id_array", new_notes_id_array);
        //    localStorage.removeItem("note_"+note_id);
        //}
        //else {
            notes_id_array.splice(notes_id_array.indexOf(note_id), 1);
            localStorage.removeItem("notes_id_array");
            localStorage.setItem("notes_id_array", notes_id_array);
            localStorage.removeItem("note_" + note_id);
        //}

        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    }
    //---------drug and drop-----------------------------------------------------------------------------------------
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    var dragObject = null;
    var mouseOffset = null;

    function getPosition(e){
        var left = 0;
        var top  = 0;

        while (e.offsetParent){
            left += e.offsetLeft
            top  += e.offsetTop
            e    = e.offsetParent
        }

        left += e.offsetLeft
        top  += e.offsetTop
        return {x:left, y:top}
    }
    function getMouseOffset(target, e) {
        var docPos  = getPosition(target)
        return {
            x: e.pageX - docPos.x,
            y: e.pageY - docPos.y
        }
    }

    function mouseDown(e) {
        dragObject = this.parentNode;
        var noteHeader = document.getElementsByClassName('noteHeader');
        for (var i = 0; i < noteHeader.length; ++i) {
            noteHeader[i].parentNode.style.zIndex = 0;
        }

        dragObject.style.zIndex = 500;
        // получить сдвиг элемента относительно курсора мыши
        mouseOffset = getMouseOffset(this, e)

        document.ondragstart = function() { return false };
        document.body.onselectstart = function() { return false };

        return false;
    }
    function mouseMove(e) {
        if (dragObject) {
            e.preventDefault();
            dragObject.style.position = 'absolute';
            dragObject.style.left = e.pageX - mouseOffset.x + 'px';
            dragObject.style.top = e.pageY - mouseOffset.y + 'px';
        }
    }
    function mouseUp(e) {
        if (dragObject) {
            var note_id = dragObject.id;
            var top = dragObject.getBoundingClientRect().top;
            var left = dragObject.getBoundingClientRect().left - 10;
            var textareaVal = dragObject.children[1].children[0].value;

            setLocalStorage(note_id, top, left, textareaVal);
        }

        dragObject = null;
    }

    //---------cookie---------------------------------------------------------------------------------------------
    (function() {
        //localStorage.clear();

        if (notes_id_array.length) {
            var notes_id_arrayLS = localStorage.getItem("notes_id_array");
            var parsed_notes_id_array = notes_id_arrayLS.split(",");

            for (var i = 0; i < parsed_notes_id_array.length; ++i) {
                var top = JSON.parse(localStorage.getItem("note_"+parsed_notes_id_array[i])).top;
                var left = JSON.parse(localStorage.getItem("note_"+parsed_notes_id_array[i])).left;
                var textareaValue = JSON.parse(localStorage.getItem("note_"+parsed_notes_id_array[i])).textareaValue;

                notesBlock.insertAdjacentHTML('beforeEnd', '<section class="note">' +
                    '<header class="noteHeader">'+
                    '<i class="fa fa-sticky-note icon"></i>'+
                    '<i class="fa fa-trash deleteButton"></i>'+
                    '</header>'+
                    '<section class="noteBody">'+
                    '<textarea name="noteTextarea" id="noteTextarea" cols="30" rows="10"></textarea>'+
                    '</section>'+
                    '</section>');

                //устанавливаем id новому стику
                var notes = document.getElementsByClassName('note');
                var newNote = notes[notes.length-1];
                newNote.setAttribute('id', parsed_notes_id_array[i] + "");

                var flag = false;
                for (var j = 0; j < parsed_notes_id_array.length; ++j) {
                    if (top == 100 + (j*233)) {
                        flag = true;
                    }
                }
                if (!flag) {
                    newNote.style.position = 'absolute';
                    newNote.style.top = top+'px';
                    newNote.style.left = left+'px';
                }

                var textareaElem = document.getElementsByTagName('textarea');
                textareaElem[i].addEventListener("change", changeTxtAreaVal);

                newNote.children[1].children[0].value = textareaValue;

            }
        }
        var deleteButtons = document.getElementsByClassName('deleteButton');

        for (var i = 0; i < deleteButtons.length; ++i) {
            deleteButtons[i].addEventListener('click', deleteNote);
        }
        // :::::::::::: drug and drop :::::::::::::::::::::
        var noteHeader = document.getElementsByClassName('noteHeader');
        for (var i = 0; i < noteHeader.length; ++i) {
            noteHeader[i].addEventListener("mousedown", mouseDown);
        }
        // ::::::::::::::::::::::::::::::::::::::::::::::::

    })();

    function changeTxtAreaVal() {
        var note_id = this.parentNode.parentNode.id;
        var top = this.parentNode.parentNode.getBoundingClientRect().top;
        var left = this.parentNode.parentNode.getBoundingClientRect().left - 10;
        var textareaVal = this.value;

        setLocalStorage(note_id, top, left, textareaVal);
    }

    function setLocalStorage(id, top, left, textareaVal) {
        var localStorageObject = {
            top: top,
            left: left,
            textareaValue: textareaVal
        }

        localStorage.setItem("note_"+id, JSON.stringify(localStorageObject));
    }
});