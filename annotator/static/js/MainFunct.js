$(document).ready(function () {
    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }

    var number = getUrlVars()["filename"];
    if (number != null) {
        console.log(number)
        document.getElementById('fileNames').value = number;
        var paragraph = document.getElementById("document_context");

        var text = document.createTextNode(number + " Context");
        paragraph.appendChild(text);
        $.ajax({
            data: {
                register_input: number,
                /*register_input: document.getElementById('thefilename').value,*/
            },

            type: 'POST',
            url: '/register'
        })
            .done(function (data) {

                if (data.error) {
                    document.getElementById('output').innerHTML = data.error
                }
                else {
                    //document.getElementById('output').value = data.answer
                    open_table()
                    document.getElementById('output').innerHTML = data.answer
                    window.history.replaceState({}, document.title, "/");
                }
            });
    }

});


var classes = {}

window.onload = function () {
    try {
        old_classes = JSON.parse(localStorage.getItem("classes"));
        for (x in old_classes) {
            console.log('old classes: ', x);
            add_classname(x, old_classes[x], true);
        }
    } catch{
        //pass
    }
};

//Build JSON object
var sentences = [];

//Class counter
//var classes = {};

function edit_size(obj) {
    obj.style.height = ""; obj.style.height = (obj.scrollHeight + 10) + "px";
    element = document.getElementById('maincontainer')

}

function open_table() {
    table = document.getElementById('legendtable');
    table.style.display = "inline-block";
}

/* Runs an export call to flask */
function export2data() {
    if (sentences.length != 0) {

        console.log("HIELO")

        doc_name = document.getElementById("fileNames").value
        if (doc_name == '') {
            doc_name = 'defaultexport'
        }
        sentences = [doc_name, sentences];

        console.log(sentences);

        var data = JSON.stringify(sentences);

        //AJAX call
        $.ajax({
            data: {
                export_input: data
            },

            type: 'POST',
            url: '/export'
        })
            .done(function (data) {

                if (data.error) {
                    $('#errorAlert').text(data.error).show();
                }
                else {
                    $('#errorAlert').hide();
                    alert('Successful! Data saved, annotation report generated in "report" folder.')
                }
            });

        event.preventDefault();
    }
    else {
        alert("Nothing to export...please key in some data.")
    }

}


/* Handles all table labels and annotated data management*/
function push2table(entry) {
    if (entry['sent'] != '') {
        sentences.push(entry);
        console.log("Number of objects in sentences:", sentences.length)
        //console.log(sentences.findIndex(x => x.sent === entry.sent));
        element = document.getElementById("sel_sent_table")
        var w = document.createElement('tr');
        w.setAttribute('id', sentences.findIndex(x => x.sent === entry.sent));
        w.setAttribute('class', 'rowtext')
        var x = document.createElement('td');
        x.setAttribute('class', 'celltext');
        x.style.border = 'solid';
        x.innerText = entry['sent'];
        var y = document.createElement('td');
        y.innerText = entry['class'];
        y.style.border = 'solid';
        var z = document.createElement('td');
        var z1 = document.createElement('button');
        z1text = document.createTextNode('Delete');
        z1.appendChild(z1text);
        z1.setAttribute('value', sentences.findIndex(x => x.sent === entry.sent));
        z1.setAttribute('onclick', 'remove_row(this.value)');
        z.appendChild(z1);
        z.style.border = 'solid';
        w.appendChild(x);
        w.appendChild(y);
        w.appendChild(z);
        element.appendChild(w);
    } else {
        alert("Can't Annotate Empty Text");
    }
}

function remove_row(index) {
    sentences.splice(index, 1);
    console.log("Deleted: ", sentences)
    document.getElementById(index).remove();
    console.log("Number of objects in sentences:", sentences.length)
}

function class2dict(classname, desc) {
    console.log('dict added')
    classes[classname] = desc;
}

function classify(classname) {
    entry = { 'sent': document.getElementById("selection").value, 'class': classname, 'class_desc': classes[classname] }
    push2table(entry);
}

/* Calls registration */
function create_class(object) {
    //console.log(document.getElementById("class_options_text").childNodes.length)
    remove_block = document.getElementById('component_block');
    if (remove_block != null) {
        remove_block.remove();
    }
    if (document.getElementById("class_options_text").childNodes.length < 4) {
        document.getElementById("class_options_text").prepend(create_class_registration());
    }
}

/* Calls registration */
function delete_class(object) {
    //console.log(document.getElementById("class_options_text").childNodes.length)
    remove_block = document.getElementById('component_block');
    if (remove_block != null) {
        remove_block.remove();
    }
    if (document.getElementById("class_options_text").childNodes.length < 4) {
        document.getElementById("class_options_text").prepend(delete_class_registration());
    }
}

/* Creates the registration for deleting classes */
function delete_class_registration() {
    var w = document.createElement('div');
    w.setAttribute('id', 'component_block');
    w.style.height = '65%';
    var x = document.createElement('input');
    x.setAttribute('id', 'deleteclassname');
    x.setAttribute('placeholder', 'Enter Class Name');
    x.style.height = '40px';
    var y = document.createElement('input');
    y.setAttribute('type', 'button');
    y.setAttribute('class', "w3-btn w3-red");
    y.setAttribute('id', 'deleteclass');
    y.setAttribute('value', 'Delete');
    y.setAttribute('onClick', 'delete_classname(document.getElementById("deleteclassname").value)');
    w.appendChild(x);
    w.appendChild(y);
    return w;
}

/* Creates the registration for new classes */
function create_class_registration() {
    var w = document.createElement('div');
    w.setAttribute('id', 'component_block');
    w.style.height = '85%';
    var x = document.createElement('input');
    x.setAttribute('id', 'addclassname')
    x.setAttribute('placeholder', 'Enter Class Name');
    x.setAttribute('class', 'standardmargin');
    var y = document.createElement('input');
    y.setAttribute('id', 'adddesc')
    y.setAttribute('placeholder', 'Enter Short Description');
    y.setAttribute('class', 'standardmargin');
    var z = document.createElement('input');
    z.setAttribute('type', 'button');
    z.setAttribute('id', 'submitclass')
    z.setAttribute('value', 'Add Class')
    z.setAttribute('class', "w3-btn w3-black");
    z.setAttribute('onClick', 'add_classname(document.getElementById("addclassname").value, document.getElementById("adddesc").value )')
    w.appendChild(x);
    w.appendChild(document.createElement('br'));
    w.appendChild(y);
    w.appendChild(document.createElement('br'));
    w.appendChild(z);
    return w;
}

/* Add Class Name as a Button and its corresponding description to dictionary */
function add_classname(classname, desc, onload = false) {
    if (classname != '' && desc != '') {
        class_list = Object.keys(classes);
        console.log('list before add ', class_list)
        console.log('to be added:', classname)
        if (class_list.includes(classname) == false) {
            class_select = document.getElementById("class_select_span");
            class_select.append(create_class_button(classname));
            class_select.style.height = '100px';
            if (onload == false) {
                remove_block = document.getElementById('component_block');
                remove_block.remove();
            }
            class2dict(classname, desc); //adds to classes object
            console.log('added: ', classes)
            localStorage.setItem("classes", JSON.stringify(classes));
        } else {

            alert("Classname exists, use another name");
        }
    } else {
        remove_block = document.getElementById('component_block');
        remove_block.remove();
        alert("Class or Description cannot be empty, enter a name");
    }
}

/* Delete Class Name Button */
function delete_classname(classname) {
    if (classname != '') {
        class_delete = document.getElementById(classname)
        class_delete.remove();
        remove_block = document.getElementById('component_block');
        remove_block.remove();
        delete classes[classname];
        localStorage.setItem("classes", JSON.stringify(classes));
    } else {
        remove_block = document.getElementById('component_block');
        remove_block.remove();
        alert("Class cannot be empty");
    }
}

/* Create the class button */
function create_class_button(classname) {
    var w = document.createElement('input');
    //w.style.height = '30px';
    //w.style.width = '50px';

    w.style.margin = '10px';
    /*w.setAttribute('src', '{{ url_for('static', filename = 'images / highlight_off - 24px.svg')}}');*/
    w.setAttribute('type', 'button');
    w.setAttribute('id', classname);
    w.setAttribute('value', classname);
    w.setAttribute('class', "w3-btn w3-red");
    w.setAttribute('onClick', 'classify(this.value)')
    return w;
}

/* Highlighted/Selected Text Extractor */
function get_selection_text() {
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
        (activeElTagName == "textarea") || (activeElTagName == "input" &&
            /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}

/* Extract Highlighted Text to Selection Output */
document.onmouseup = document.onkeyup = document.onselectionchange = function () {
    document.getElementById("selection").value = get_selection_text();
};

/* Controls File Path Inputs */
function open_file() {
    classlabel = document.getElementById('classes_container');
    classlabel.style.display = 'none';
    filepath = document.getElementById('uploadfile_container');
    filepath.style.display = 'inline-block';
    outputz = document.getElementById("output_container");
    outputz.style.display = 'inline-block';
}

/* Controls Label Type */
function open_label() {
    outputz = document.getElementById("output_container");
    outputz.style.display = 'none';
    filepath = document.getElementById('uploadfile_container');
    filepath.style.display = 'none';
    classlabel = document.getElementById('classes_container');
    classlabel.style.display = 'inline-block';
}

function changers() {
    if (document.getElementById("fileInput").files.length == 0) {
        alert("ERROR: YOU NEED TO ENTER A FILE IN!")
        return false;
    }
    else {
    }
}