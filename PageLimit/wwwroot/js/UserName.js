var GetUserId = 0;
var DropDownCountry = [];
$(document).ready(function () {

    GetUserDetails();
    $('#HideConformation').hide();

    $.ajax({
        url: '/User/GetCountryDetails',
        type: 'GET',
        data: {
            ModuleName: "India"
        },
        success: function (response) {
            if (response.status) {
                var data = response.data;
                DropDownCountry = data
            }

        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });

    $(document).on('click', '#AddUser', function () {
        GetUserId = 0;
        $('#myUser').modal('show');
        $('#SaveModel').text('Save');
        $('#FromUserDetails').empty("");
        DyanamicHtml();
    });

    $(document).on('click', '#CloseModel', function () {
        $('#myUser').modal('hide');
        $('#FromUserDetails').empty("");
    });

    $(document).on('click', '#SaveModel', function () {
        $("#FromUserDetails").validate();
        var ValidOfUser = $("#FromUserDetails").valid();
        var allGenderValid = true;

        $('.UserDetailsDyanamic').each(function () {
            var isValid = validateGenderSelection(this);
            if (!isValid) {
                allGenderValid = false;
            }
        });

        if (ValidOfUser && !allGenderValid) {
            var UserData = [];
            var ClosestDiv = $('#FromUserDetails .UserDetailsDyanamic');
            $.each(ClosestDiv, function (index, values) {
                var countryId = $(values).find('.CountryId').val();
                var UserId = parseInt(GetUserId) || 0;
                var Name = $(values).find('.Name').val();
                var PhoneNo = $(values).find('.PhoneNo').val();
                var Email = $(values).find('.Email').val();
                var Address = $(values).find('.Address').val();
                var CountryId = parseInt(countryId) || null;
                var Skill = $(values).find('.Skill').val();
                var GenderLabel = $(values).find('input[type="radio"]:checked').next('label').text().trim();
                UserData.push({
                    UserId: UserId,
                    Name: Name,
                    Gender: GenderLabel,
                    Skill: Skill,
                    PhoneNo: PhoneNo,
                    Email: Email,
                    Address: Address,
                    CountryId: CountryId,
                });
            });

            var input = {
                userDetails: UserData
            };

            var URL = '/User/InsertUpdateUser';

            $.ajax({
                url: URL,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(input),
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
                    $('#FromUserDetails').empty("");
                    $('#SaveModel').text('Update');
                    var data = response.data;

                    $.each(data, function (index, value) {
                        let numberIncr = Math.random().toString(36).substring(2);
                        var rowadd = $('.UserDetailsDyanamic').length
                        var DynamicLableNo = rowadd + 1;

                        var CountrySelectOptions = "";
                        var defaultOption = '<option value="">--Select--</option>';
                        var CountrySelectOptions = DropDownCountry.map(function (countryId) {
                            var isSelected = countryId.countryId == value.countryId ? 'selected' : '';
                            return `<option value="${countryId.countryId}" ${isSelected}>${countryId.countryName}</option>`;
                        }).join('');

                        var html =
                        `
                            <div class="row mt-2 mb-3 UserDetailsDyanamic">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                                    <label class="DynamicLable">User Name ${DynamicLableNo}</label>
                                </div>
                                <div class="col-md-3 col-lg-3 col-sm-12 col-12">
                                    <div class="form-group">
                                        <label>User Name<span id="Asterisk">*</span></label>
                                        <input type="text" class="form-control Name" placeholder="Name" id="Name${numberIncr}" name="Name${numberIncr}" value="${value.name}" required>
                                    </div>
                                </div>
                                <div class="col-md-6 col-lg-4 col-sm-6 col-6">
                                    <div class="form-group">
                                        <label style="margin-top: 7px;">Gender<span id="Asterisk">*</span></label>
                                        <div class="d-flex" style="margin-top: 4px;">
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input Male" type="radio" name="gender${numberIncr}" id="Male${numberIncr}" value="Male">
                                                <label class="form-check-label" for="Male${numberIncr}">Male</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input Female" type="radio" name="gender${numberIncr}" id="Female${numberIncr}" value="Female">
                                                <label class="form-check-label" for="Female${numberIncr}">Female</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input Other" type="radio" name="gender${numberIncr}" id="Other${numberIncr}" value="Other">
                                                <label class="form-check-label" for="Other${numberIncr}">Other</label>
                                            </div>
                                        </div>
                                        <div class="error-message error" style="color: red; display: none;">Please select your gender.</div>
                                    </div>
                                </div>
                                <div class="col-md-6 col-lg-5 col-sm-6 col-6">
                                    <div class="form-group">
                                        <label>PhoneNo<span id="Asterisk">*</span></label>
                                        <input type="text" class="form-control PhoneNo" placeholder="Phone Number" id="PhoneNo${numberIncr}" name="PhoneNo${numberIncr}" value="${value.phoneNo}" maxlength="10" min="10" required>
                                    </div>
                                </div>
                                <div class="col-md-6 col-lg-3 col-sm-6 col-6 mt-2">
                                    <div class="form-group">
                                        <label>Email<span id="Asterisk">*</span></label>
                                        <input type="text" class="form-control Email" placeholder="Email" id="Email${numberIncr}" name="Email${numberIncr}" value="${value.email}" required>
                                    </div>
                                </div>
                                <div class="col-md-6 col-lg-4 col-sm-6 col-6 mt-2">
                                    <div class="form-group">
                                        <label>Address</label>
                                        <input type="text" class="form-control Address" placeholder="Address" id="Address${numberIncr}" name="Address${numberIncr}" value="${value.address}">
                                    </div>
                                </div>
                                <div class="col-md-6 col-lg-5 col-sm-12 col-12 mt-2">
                                    <div class="form-group">
                                        <label>Country<span id="Asterisk">*</span></label>
                                        <select class="form-control CountryId" id="CountryId${numberIncr}" name="CountryId${numberIncr}" required>
                                            ${defaultOption}${CountrySelectOptions}
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-10 col-lg-10 col-sm-10 col-10 mt-2">
                                    <div class="form-group">
                                        <label>Skill<span id="Asterisk">*</span></label>
                                        <input type="text" class="form-control Skill" placeholder="Skill" id="Skill${numberIncr}" name="Skill${numberIncr}" value="${value.skill}" required>
                                    </div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-2 thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'};">
                                    <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                                        <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                </div>
                            </div>
                        `;
                        $('#FromUserDetails').append(html);
                        if (value.gender === 'Male') {
                            $(`#Male${numberIncr}`).prop('checked', true);
                        } else if (value.gender === 'Female') {
                            $(`#Female${numberIncr}`).prop('checked', true);
                        } else if (value.gender === 'Other') {
                            $(`#Other${numberIncr}`).prop('checked', true);
                        }
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
    
    $(document).on('click', '.delete-btn', function () {
        GetUserId = $(this).data('id');
        $('#HideConformation').modal('show');
        $('#AddUser').hide();
        $('#dynamicTable').css('margin-top', '47px');
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

    $(document).on('change', 'input[type="radio"]', function () {
        var rowElement = $(this).closest('.UserDetailsDyanamic');ss
        validateGenderSelection(rowElement);
    });

    $(document).on('input', '.Name, .Skill', function () {
        this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
    });

    $(document).on('input', '.PhoneNo', function () {
        this.value = this.value.replace(/[^0-9]/g, '');s
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

var html = "";
function DyanamicHtml() {
    let numberIncr = Math.random().toString(36).substring(2);
    var rowadd = $('.UserDetailsDyanamic').length
    var DynamicLableNo = rowadd + 1;

    var CountrySelectOptions = "";
    var defaultOption = '<option value="">--Select--</option>';
    if (DropDownCountry != null && DropDownCountry.length > 0) {
        CountrySelectOptions = DropDownCountry.map(function (countryId) {
            return `<option value="${countryId.countryId}">${countryId.countryName}</option>`;
        }).join('');
    }

    html = `
        <div class="row mt-2 mb-3 UserDetailsDyanamic">
            <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2 d-flex flex-column mb-2">
                <label class="DynamicLable">User Name ${DynamicLableNo}</label>
            </div>
            <div class="col-md-3 col-lg-3 col-sm-12 col-12">
                <div class="form-group">
                    <label>User Name<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control Name" placeholder="Name" id="Name${numberIncr}" name="Name${numberIncr}" required>
                </div>
            </div>
            <div class="col-md-6 col-lg-4 col-sm-6 col-6">
                <div class="form-group">
                    <label style="margin-top: 7px;">Gender<span id="Asterisk">*</span></label>
                    <div class="d-flex" style="margin-top: 4px;">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input Male" type="radio" name="gender${numberIncr}" id="Male${numberIncr}" value="Male${numberIncr}">
                            <label class="form-check-label" for="Male${numberIncr}">Male</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input Female" type="radio" name="gender${numberIncr}" id="Female${numberIncr}" value="Female${numberIncr}">
                            <label class="form-check-label" for="Female${numberIncr}">Female</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input Other" type="radio" name="gender${numberIncr}" id="Other${numberIncr}" value="Other${numberIncr}">
                            <label class="form-check-label" for="Other${numberIncr}">Other</label>
                        </div>
                    </div>
                    <div class="error-message error" style="color: red; display: none;">Please select your gender.</div>
                </div>
            </div>
            <div class="col-md-6 col-lg-5 col-sm-6 col-6">
                <div class="form-group">
                    <label>PhoneNo<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control PhoneNo" placeholder="Phone Number" id="PhoneNo${numberIncr}" name="PhoneNo${numberIncr}" maxlength="10" min="10" required>
                </div>
            </div>
            <div class="col-md-6 col-lg-3 col-sm-6 col-6 mt-2">
                <div class="form-group">
                    <label>Email<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control Email" placeholder="Email" id="Email${numberIncr}" name="Email${numberIncr}" required>
                </div>
            </div>
            <div class="col-md-6 col-lg-4 col-sm-6 col-6 mt-2">
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" class="form-control Address" placeholder="Address" id="Address${numberIncr}" name="Address${numberIncr}">
                </div>
            </div>
            <div class="col-md-6 col-lg-5 col-sm-12 col-12 mt-2">
                <div class="form-group">
                    <label>Country<span id="Asterisk">*</span></label>
                    <select class="form-control CountryId" id="CountryId${numberIncr}" name="CountryId${numberIncr}" required>
                        ${defaultOption}${CountrySelectOptions}
                    </select>
                </div>
            </div>
            <div class="col-md-10 col-lg-10 col-sm-10 col-10 mt-2">
                <div class="form-group">
                    <label>Skill<span id="Asterisk">*</span></label>
                    <input type="text" class="form-control Skill" placeholder="Skill" id="Skill${numberIncr}" name="Skill${numberIncr}" required>
                </div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2 col-2 thiswillshow" style="display: ${rowadd == 0 ? 'none' : 'block'};">
                <div class="p-1 d-flex justify-content-center align-items-center buttonsRow">
                    <button id="RemoveButton" class="btn DynrowRemove" type="button" onclick="removeRow(this)"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `;
    $('#FromUserDetails').append(html);
    updateRowLabels();
    updateRemoveButtons();
}

function updateRowLabels() {
    $('.UserDetailsDyanamic').each(function (index) {
        $(this).find('.DynamicLable').text('User Name ' + (index + 1));
    });
}

function updateRemoveButtons() {
    var rows = $('.UserDetailsDyanamic');
    rows.each(function (index) {
        var removeButtonDiv = $(this).find('.thiswillshow');
        if (rows.length == 1) {
            removeButtonDiv.css('display', 'none');
        } else {
            removeButtonDiv.css('display', 'block');
        }
    });
}

function removeRow(button) {
    var totalRows = $('.UserDetailsDyanamic').length;
    if (totalRows > 1) {
        $(button).closest('.UserDetailsDyanamic').remove();
        updateRowLabels();
        updateRemoveButtons();
    }
}

function validateGenderSelection(rowElement) {
    var genderSelected = $(rowElement).find('input[type="radio"]:checked').length > 0;

    if (!genderSelected) {
        $(rowElement).find('.form-group:has(input[type="radio"])').find('.error-message').show();
    } else {
        $(rowElement).find('.form-group:has(input[type="radio"])').find('.error-message').hide();
    }
}

$(document).on('input', '.Email', function () {
    var inputField = $(this);
    var parentElement = inputField.closest('.form-group');
    var errorLabel = parentElement.find('.error-message');
    var inputValue = inputField.val();
    errorLabel.filter('[data-for="' + inputField.attr('id') + '"]').remove();
    if (inputField.prop('required') && inputValue.length === 0) {
        inputField.removeClass('error');
        return true;
    }
    if (/^[^\s@]+@[^\s@]+(\.[^\s@]+)+$/.test(inputValue)) {
        inputField.removeClass('error');
        errorLabel.remove();
    }
    else if (inputValue.length > 0 && errorLabel.length === 0) {
        inputField.addClass('error');
        parentElement.append('<label class="error-message" style="font-weight: 600;color: red !important;font-size: 12px !important;margin-top: .5rem;">Valid email is required</label>');
        return false;
    }
    else if (inputValue.length === 0) {
        inputField.removeClass('error');
        errorLabel.remove();
    }
    return true;
});
