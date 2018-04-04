let resumes = []; //array to store submitted resumes

class Resume {
    constructor(name, address, url, imageLink, linkedIn, education, workExperience, customFields) {
        this.name = name;
        this.address = address;
        this.url = url;
        this.imageLink = imageLink;
        this.linkedIn = linkedIn;
        this.education = education;
        this.workExperience = workExperience;
        this.id = Resume.instances;
        this.customFields = customFields;

        Resume.instances++;
    }

    generateResume() {


        let customHTML = "";

        console.log(this.customFields);

        if (this.customFields.length > 0) {

            this.customFields.forEach((field) => {

                customHTML += `<div class="row">
                        <div class="col-md-12">

                            <h2 class="resume-section-title">${field.name}</h2>

                            <p class="resume-work-experience">${field.value}</p>


                        </div>
                    </div>`


            });



        }


        $("#resume-results .list-group:first").append(`

  <a href="#" class="list-group-item list-group-item-action flex-column align-items-start
  resume-listed
  "
   style="display: none;" data-resume-id="${this.id}">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${this.name}</h5>
                            <small class="text-muted">${this.linkedIn}</small>
                        </div>
                        <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                        <small class="text-muted">Donec id elit non mi porta.</small>
                    </a>
        
                <div class="resume" data-resume-id="${this.id}">
                 
               
               
               <i class="fas fa-times-circle resume-close" data-resume-id="${this.id}"></i>
                

                    <div class="row">
                        <div class="col-md-5">

                            <img src="${this.imageLink}" class="resume-picture" alt="Profile Picture">

                        </div>


                        <div class="col-md-7">

                            <h1 class="resume-title">${this.name}</h1>

                            <p class="resume-address">${this.address}</p>

                            <a href="${this.linkedIn}" class="resume-linkedin" target="_blank">${this.linkedIn}</a>


                        </div>


                    </div>

                    <div class="row">
                        <div class="col-md-12">

                            <h2 class="resume-section-title">Education</h2>

                            <p class="resume-education">${this.education}</p>


                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">

                            <h2 class="resume-section-title">Work Experience</h2>

                            <p class="resume-work-experience">${this.workExperience}</p>


                        </div>
                    </div>
                    
                    
                   ${customHTML}

                </div>
        `);

        /* ------------------------------------------------------------|
        | RESUME EVENTS
        *-------------------------------------------------------------*/
        //it should be added here, since its dinamically generated content!

        /* CLOSING RESUME =========================================== */

        //avoid multistacking clicking events
        $('.resume-close').unbind('click')
            .on('click', function () {

                let ownerResumeId = $(this).data('resume-id');

                console.log(`Closing resume ${ownerResumeId}`);


                console.log($(this).parent());
                $(this).parent().slideUp(1000, function () {

                    $(`.resume-listed[data-resume-id=${ownerResumeId}]`).fadeIn();
                });
            });


        /* OPENING RESUME =========================================== */

        $(".resume-listed").on('click', function () {

            let ownerResumeId = $(this).data('resume-id');

            console.log(`Closing resume ${ownerResumeId}`);

            $(this).fadeOut(1000, function () {
                $(`.resume[data-resume-id=${ownerResumeId}]`).slideDown(1000);
            });

        })


    }

    //
    // get info() {
    //     return `This is a ${this.name} and it has ${this.address}`;
    // }
    //
    // set updateAttr(params) {
    //
    //     this.name = params[0] || "";
    //     this.address = params[1] || "";
    // }

    static numberOfResumes() {
        return Resume.instances;
    }
}

Resume.instances = 0;