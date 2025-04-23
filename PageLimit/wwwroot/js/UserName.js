var GetUserId = 0;
$(document).ready(function () {

    GetUserDetails();
    ClearInputData();
    $('#HideConformation').hide();

    $.ajax({
        url: '/User/GetCountryDetails',
        type: 'GET',
        data: {
            ModuleName: "India" // Query parameter
        },
        success: function (response) {
            if (response.status) {
                var $CountryDropdown = $('#CountryId');
                var data = response.data;
                $CountryDropdown.empty();
                var valueproperty = Object.keys(data[0])[0];
                var textproperty = Object.keys(data[0])[1];

                $CountryDropdown.append($('<option>', {
                    value: '',
                    text: '--Select--',
                }));

                $.each(data, function (index, item) {
                    $CountryDropdown.append($('<option>', {
                        value: item[valueproperty],
                        text: item[textproperty],
                    }));
                });
            }

        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });

    $(document).on('click', '#AddUser', function () {
        ClearInputData();
        GetUserId = 0;
        $('#myUser').modal('show');
        $('#SaveModel').text('Save');
    });

    $(document).on('click', '#CloseModel', function () {
        ClearInputData();
        $('#myUser').modal('hide');
    });

    $(document).on('click', '#SaveModel', function () {
        $("#FromUserDetails").validate();
        var ValidOfUser = $("#FromUserDetails").valid();
        if (ValidOfUser) {
            var DataUser = JSON.parse(JSON.stringify(jQuery('#FromUserDetails').serializeArray()));
            var objvalue = {};
            $.each(DataUser, function (index, item) {
                objvalue[item.name] = item.value;
            });

            var CountryId = $('#CountryId').val();
            objvalue.UserId = parseInt(GetUserId) || null;
            objvalue.CountryId = parseInt(CountryId) || null;


            var URL = '/User/InsertUpdateUser';

            $.ajax({
                url: URL,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(objvalue),
                success: function (response) {
                    console.log('POST success:', response);
                    if (response.status) {
                        $('#myUser').modal('hide');
                        $('#AlertPop').removeClass('d-none');
                        $('.alert').text(response.message);
                        setTimeout(function () {
                            $('#AlertPop').addClass('d-none');
                            $('.alert').text('');
                        }, 1500);
                        GetUserDetails();
                    }
                },
                error: function (xhr, status, error) {
                    console.error('POST error:', error);
                }
            });
        }
    });

    $(document).on('click', '.edit-btn', function () {
        GetUserId = $(this).data('id');
        $.ajax({
            url: '/User/GetUserDetails?userId=' + GetUserId,
            type: 'GET',
            success: function (response) {
                if (response.status) {
                    $('#myUser').modal('show');
                    $('#SaveModel').text('Update');
                    ClearInputData();
                    var data = response.data;
                    $('#Name').val(data[0].name);
                    $('#PhoneNo').val(data[0].phoneNo);
                    $('#Email').val(data[0].email);
                    $('#Address').val(data[0].address);
                    $('#CountryId').val(data[0].countryId).trigger('change');
                    $('#Skill').val(data[0].skill);
                    var gender = data[0].gender;
                    if (gender === 'Male') {
                        $('#Male').prop('checked', true);
                    } else if (gender === 'Female') {
                        $('#Female').prop('checked', true);
                    } else if (gender === 'Other') {
                        $('#Other').prop('checked', true);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
    var textConformation = "";
    $(document).on('click', '#yesBtn', function () {
        textConformation = "Yes";
        $('#HideConformation').modal('hide');
        if (textConformation == "Yes") {
            $.ajax({
                url: '/User/DeleteUserDetails',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ UserId: GetUserId }),
                success: function (response) {
                    console.log('POST success:', response);
                    if (response.status) {
                        GetUserDetails();
                        $('#AlertPop').removeClass('d-none');
                        $('.alert').text(response.message);
                        setTimeout(function () {
                            $('#AlertPop').addClass('d-none');
                            $('.alert').text('');
                        }, 1500);
                        $('#dynamicTable').css('margin-top', '0px');
                        $('#AddUser').show();
                    }
                },
                error: function (xhr, status, error) {
                    console.error('POST error:', error);
                }
            });
        }
    });

    $(document).on('click', '.delete-btn', function () {
        GetUserId = $(this).data('id');
        $('#HideConformation').modal('show');
        $('#AddUser').hide();
        $('#dynamicTable').css('margin-top', '47px');
    });
});


function GetUserDetails() {
    var userId = null;
    $.ajax({
        url: '/User/GetUserDetails?userId=' + userId,
        type: 'GET',
        success: function (response) {
            if (response.status) {
                var data = response.data;
                $('#dynamicTable tbody').empty();
                if (!data || data.length === 0) {
                    $('#dynamicTable th:last').remove();

                    var row = $('<tr>');
                    var noDataCell = $('<td colspan="7">').text('No data found').css('text-align', 'center');
                    row.append(noDataCell);
                    $('#dynamicTable tbody').append(row);
                    return;
                }
                $.each(data, function (index, item) {
                    var row = $('<tr>');
                    row.append($('<td>').text(item.name || '-'));
                    row.append($('<td>').text(item.email || '-'));
                    row.append($('<td>').text(item.phoneNo || '-'));
                    row.append($('<td>').text(item.countryName || '-'));
                    row.append($('<td>').text(item.gender || '-'));
                    row.append($('<td>').text(item.skill || '-'));
                    row.append($('<td>').text(item.address || '-'));
                    var actionCell = $('<td class="d-flex justify-content-center">');
                    var editIcon = $('<i class="fas fa-edit"></i>').addClass('edit-btn').css('cursor', 'pointer').attr('data-id', item.userId);
                    var deleteIcon = $('<i class="fas fa-trash-alt"></i>').addClass('delete-btn').css('cursor', 'pointer').attr('data-id', item.userId);

                    actionCell.append(editIcon).append(' ').append(deleteIcon);
                    row.append(actionCell);
                    $('#dynamicTable tbody').append(row);
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

function ClearInputData() {
    $('#Name').val('');
    $('#PhoneNo').val('');
    $('#Email').val('');
    $('#Address').val('');
    $('#CountryId').val('').trigger('change');
    $('#Skill').val('');
    $('#Male').prop('checked', false);
    $('#Female').prop('checked', false);
    $('#Other').prop('checked', false);
}