$(function() {
    $( "#dialogtemplate2" ).dialog();
    $('#myTable tbody').on('click', 'tr', function () {
        $('#myTable').DataTable().$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        console.log('Selected')
    })
    // Enable the buttons.
    $('#singlebutton').prop("disabled",true);
    $('#updatebutton').prop("disabled",true);
    $('#reportbutton').prop("disabled",true);
    $('#reportbutton').css("color", "#0d010d");
    $('#singlebutton').css("color", "#0d010d");
    $('#updatebutton').css("color", "#0d010d");
});

// Populate the table with work items.
function GetItems() {
        $.ajax("/request", {
                type: 'POST',
                success: function (data, status, xhr) {
                    console.log('it works');
                    console.log('data.Items', data.Items);

                // Enable the buttons.
                $('#singlebutton').prop("disabled",false);
                $('#updatebutton').prop("disabled",false);
                $('#reportbutton').prop("disabled",false);
                $('#reportbutton').css("color", "#FFFFFF");
                $('#singlebutton').css("color", "#FFFFFF");
                $('#updatebutton').css("color", "#FFFFFF");


               $('#myTable').dataTable({
                        "bAutoWidth" : false,
                        "aaData" : data.Items,
                   "bDestroy": true,
                        "columns" : [ {
                            "data" : "id"
                        }, {
                            "data" : "guide"
                        }, {
                            "data" : "date"
                        } , {
                            "data" : "description"
                        }, {
                            "data" : "status"
                        }    ]
                    });
                    document.getElementById("info3").innerHTML = "Active Items";
                },
            error: function (jqXhr, textStatus, errorMessage) {
                $('p').append('Error' + errorMessage);
            }
        });
};


function Report() {
    // Get the email address.
    const e = document.getElementById("manager");
    const value = e.options[e.selectedIndex].value;// get selected option value
    const email = e.options[e.selectedIndex].text;

    $.ajax('/report', {
        type: 'POST',
        data: 'email=' + email,
        success: function (data, status, xhr) {
            alert('Email message sent.');
        },
        error: function (jqXhr, textStatus, errorMessage) {
            $('p').append('Error' + errorMessage);
        }
    });
};

function UpdateItem()
{
    $("#modform").show();
   const id = document.getElementById('id').value;
    const description = document.getElementById('description').value
    const status = document.getElementById('status').value;

    if (id == "")
    {
        alert("Please select an item from the table");
        return;
    }

    if (description.length > 350)
    {
        alert("Description has too many characters");
        return;
    }

    if (status.length > 350)
    {
        alert("Status has too many characters");
        return;
    }

    $.ajax('/changewi', {
        type: 'POST',
        data: 'id=' + id + '&description=' + description+ '&status=' + status,
        success: function (data, status, xhr) {

            var msg = event.target.responseText;
            alert("You have successfully modified the item.");
            console.log('modified', data.id)

            $('#id').val("");
            $('#description').val("");
            $('#status').val("");

            //Refresh the grid.
            GetItems();

        },
        error: function (jqXhr, textStatus, errorMessage) {
            $('p').append('Error' + errorMessage);
        }
    });
};


function GetSingleItem() {
    if (!document.getElementsByClassName('selected').length)
    {
        alert("Please select an item from the table");
        return;
    }
    const id = document.getElementsByClassName('selected')[0].childNodes[0].innerHTML
    document.getElementById('id').value = id;
    const description = document.getElementsByClassName('selected')[0].childNodes[4].innerHTML
    document.getElementById('description').value = description;
    const status = document.getElementsByClassName('selected')[0].childNodes[3].innerHTML
    document.getElementById('status').value = status;
    $('#modform').show()
};


function addItem(){

        const guide = document.getElementById('guide').value
        const description = document.getElementById('description').value
        const status = document.getElementById('status').value

        //var description = $("textarea#description").val();
        if (description.length > 350)
        {
            alert("Description has too many characters");
            return;
        }
        if (description.length == 0)
        {
            alert("Enter a description.");
            return;
        }
        if (guide.length == 0)
        {
            alert("Enter a guide.");
            return;
        }
        if (status.length == 0)
        {
            alert("Enter a status.");
            return;
        }
        //var status = $("textarea#status").val();
        if (status.length > 350)
        {
            alert("Status has too many characters");
            return;
        }

        $.ajax('/add', {
            type: 'POST',  // http GET method
            data: 'guide=' + guide + '&description=' + description+ '&status=' + status,
            success: function (data) {
                alert("You have successfully added the item.")
                console.log("You have successfully added the item.")
                location.reload();
            },
            error: function (jqXhr, textStatus, errorMessage) {
                console.log('An error!')
                $('p').append('Error' + errorMessage);
            }
        });
    };

