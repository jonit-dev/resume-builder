$(function () {

    let formFields = getFormData();


    //first turn off resume results

    $("#resume-results").hide();


    //cursor starting in the name field
    $("#form-name").focus();


    /* ------------------------------------------------------------|
    | FORM SUBMISSION HANDLING
    *-------------------------------------------------------------*/


    $("#mainForm").on('submit', function (e) {

        let formFields = getFormData();

        e.preventDefault();//avoid form default submission


        /* VALIDATION =========================================== */
        //lets check if we have some empty field or with some wrong format

        if (!validateFields(formFields)) {
            return false;
        }

        /* RESUME BUILDING =========================================== */

        //grab all data from input fields and create resume obj


        let newResume = new Resume(
            formFields[0].value,
            formFields[1].value,
            formFields[2].value,
            formFields[3].value,
            formFields[4].value,
            formFields[5].value,
            formFields[6].value,
            formFields[7].value,
        );


        resumes.push(newResume);  //add to my created resumes list


        console.log(newResume);


        //prepopulate resume-results form field
        $(`.resume-title[data-resume-id=${newResume.id}]`).text(newResume.name);
        $(`.resume-address[data-resume-id=${newResume.id}]`).text(newResume.address);
        $(`.resume-linkedin[data-resume-id=${newResume.id}]`).text(newResume.linkedIn);
        $(`.resume-education[data-resume-id=${newResume.id}]`).text(newResume.education);
        $(`.resume-work-experience[data-resume-id=${newResume.id}]`).text(newResume.workExperience);


        //set resume picture and hyperlink attributes
        $(`.resume-picture[data-resume-id=${newResume.id}]`).attr('src', newResume.imageLink);

        $(`.resume-linkedin[data-resume-id=${newResume.id}]`).attr('href', newResume.linkedIn);


        console.log(resumes);


        //clear the form on submit

        $("#mainForm .form-control").each(function () {
            $(this).val('');
        });


        //generate the resume

        newResume.generateResume();


        /* Animations =========================================== */


        $("#mainForm").slideUp(1000, function () {

            $("#resume-results").slideDown();

        });


    });


    /* Resume Builder Handling Functions =========================================== */

    function getFormData() {


        //before, lets take some multiline values (more complex)

        let formEducationArray = [];
        $(".form-education").each(function(){
            formEducationArray.push($(this).val());
        });

        let formWorkArray = [];
        $(".form-work").each(function(){
            formWorkArray.push($(this).val());
        });

        let formCustom = [];
        $(".form-custom").each(function(){
            formCustom.push({name: $(this).attr('name'), value: $(this).val()});
        });




        return [
            {name: "form-name", value: $("#form-name").val()},
            {name: "form-address", value: $("#form-address").val()},
            {name: "form-url", value: $("#form-url").val()},
            {name: "form-image-link", value: $("#form-image-link").val()},
            {name: "form-linkedin", value: $("#form-linkedin").val()},
            {name: "form-education", value: formEducationArray},
            {name: "form-work", value: formWorkArray},
            {name: "form-custom", value: formCustom},
        ];
    }

    function validateFields(formFields) {


        //start by setting all validation flags hidden
        $('.form-validation').hide();


        console.log('beginning validation');

        let formHasErrors = false;

        //check all fields at once (DRY!)
        for (let field of formFields) {
            console.log(field);

            let prettyField = field.name.replace('form-', '');


            if(typeof field.value !== 'object') { //if we are not validating the data array (custom sections)
                if (field.value.length === 0 || typeof field.value === 'undefined') {

                    let flag = $(`.form-validation[data-owner-name=${field.name}]`);




                    //turn the validation flags on!
                    flag
                        .text(`Please, fill your ${prettyField}.`)
                        .show();

                    flag.prev().attr('form-flagged-field', 'true'); //set parent attribute as flagged

                    formHasErrors = true;
                    console.log()
                }
            }



            //validate links
            if (field.name === 'form-url' || field.name === 'form-image-link' || field.name === 'form-linkedin') {

                let flag = $(`.form-validation[data-owner-name=${field.name}]`);

                if (!validateURL(field.value)) {
                    //turn the validation flags on!
                    flag
                        .text(`Please, type a correct URL format.`)
                        .show();
                    formHasErrors = true;
                }

            }

            //validate education and work fields

            //check if its array
             if(typeof field.value === 'object') {

                let i = 0;
                for(let data of field.value) {
                    if(data.length === 0) {
                        let flag = $(`.form-validation[data-owner-name=${field.name}]`);

                        flag
                            .text(`Please, type a correct ${prettyField} format.`)
                            .show();

                        // alert(`Empty field on ${prettyField}. Please correct it before continuing.`);
                        formHasErrors = true;

                    }
                    i++;
                }


             }



        }


        if (formHasErrors) {
            return false;
        } else {
            console.log('passed validation');
            return true;
        }
    }


    /* ------------------------------------------------------------|
      | RESUME BUILDER BUTTON HANDLING
      *-------------------------------------------------------------*/

    $("#resume-builder-init").on('click', function () {

        $("#mainForm").slideToggle();
        $("#resume-results").fadeToggle();

    });


    /* ------------------------------------------------------------|
    | CUSTOM SECTION HANDLING
    *-------------------------------------------------------------*/


    $("#custom-category").on('click',function(){

        let categoryName = prompt('Whats the section name?', 'Section Name');

        let html = ` <div class="form-group">
                        <label for="form-${categoryName.toLowerCase()}">${categoryName}</label>


                        <!--MULTILINE EDUCATION FIELDS-->

                        <input type="text" class="form-control form-custom form-${categoryName.toLowerCase()}"
                               placeholder="" value="" name="${categoryName}"
                               data-form-flagged-field="false" style="
                               width: 70%; display: inline-block; margin-left:1rem;"
                               data-form-education-id="0"
                               data-owner-id="0"
                        >

                      


                        <small class="form-text text-muted form-validation" data-owner-name="form-${categoryName.toLowerCase()}"
                               style="display: none"></small>
                    </div>`

        $(this).before(html);

    });




    /* ------------------------------------------------------------|
    | MULTILINE EDUCATION AND WORK EXPERIENCE
    *-------------------------------------------------------------*/


/* EDUCATION =========================================== */

    numberOfFields = 0;

    function educationAdd() {


        numberOfFields++;

        let htmlContent = `
    <div class="form-group">
            <label for="form-education">Education</label>


            <!--MULTILINE EDUCATION FIELDS-->

            <input type="text" class="form-control form-education"
        placeholder="" value=""
        data-form-flagged-field="false" style="
        width: 80%; display: inline-block; margin-left:1rem;"
        data-form-education-id="${numberOfFields}"
        >

        <i class="fas fa-plus-circle add-item" data-owner="education"></i>


            <small class="form-text text-muted form-validation" data-owner-name="form-education"
            data-owner-id="${numberOfFields}"
        style="display: none"></small>
            </div>
                `;


        $(".add-item[data-owner=education]").on('click',function(){


            $(this).parent().after(htmlContent);

            $(".add-item[data-owner=education]").unbind('click');

            educationAdd();



        })
    }
    educationAdd();




    /* EDUCATION =========================================== */

    workFields = 0;

    function workAdd() {


        workFields++;

        let htmlContent = `
    <div class="form-group">
            <label for="form-education">Work Experience</label>


            <!--MULTILINE EDUCATION FIELDS-->

            <input type="text" class="form-control form-work"
        placeholder="" value=""
        data-form-flagged-field="false" style="
        width: 70%; display: inline-block; margin-left:1rem;"
        data-form-education-id="${workFields}"
        >

        <i class="fas fa-plus-circle add-item" data-owner="work"></i>


            <small class="form-text text-muted form-validation" data-owner-name="form-work"
        style="display: none"></small>
            </div>
                `;


        $(".add-item[data-owner=work]").on('click',function(){


            $(this).parent().after(htmlContent);

            $(".add-item[data-owner=work]").unbind('click');

            workAdd();



        })
    }
    workAdd();





});