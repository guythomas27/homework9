console.log('Hello World!');

const name = 'Guy Cordell';
let hasDownloadedResume = false;
let downloadCount = 0;

function showGreeting(personName)
{
    return 'Hello, my name is ' + personName + '! Welcome to my portfolio!';
}

function daysUntilDeadline(deadlineDate)
{
    const currentDate = new Date();
    const futureDate = new Date(deadlineDate);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const timeDifference = futureDate - currentDate;

    return Math.ceil(timeDifference / millisecondsPerDay);
}

function getSavedSkills()
{
    const savedSkills = localStorage.getItem('skillsList');

    if (savedSkills)
    {
        return JSON.parse(savedSkills);
    }

    return [];
}

function saveSkills(skills)
{
    localStorage.setItem('skillsList', JSON.stringify(skills));
}

$(document).ready(function ()
{
    const greetingElement = $('#greetingMessage');
    const deadlineText = $('#deadlineDays');
    const downloadCountText = $('#downloadCount');
    const skillInput = $('#skillInput');
    const addSkillBtn = $('#addSkillBtn');
    const skillsList = $('#skillsList');
    const educationTableBody = $('#educationTableBody');
    const experienceTableBody = $('#experienceTableBody');
    const navMenu = $('#navMenu');
    const projectsContainer = $('#projectsContainer');
    const sortProjectsBtn = $('#sortProjectsBtn');

    const resumeButtons =
    [
        $('#resumeButtonTop'),
        $('#resumeButtonFooter')
    ];

    const projectDeadline = '2026-12-09';
    const remainingDays = daysUntilDeadline(projectDeadline);

    const savedDownloadCount = localStorage.getItem('downloadCount');

    if (savedDownloadCount !== null)
    {
        downloadCount = parseInt(savedDownloadCount, 10);
    }

    if (greetingElement.length)
    {
        greetingElement.text(showGreeting(name));
    }

    if (deadlineText.length)
    {
        deadlineText.text(remainingDays);
    }

    if (downloadCountText.length)
    {
        downloadCountText.text(downloadCount);
    }

    resumeButtons.forEach(function (button)
    {
        if (button.length)
        {
            button.on('click', function ()
            {
                downloadCount++;
                localStorage.setItem('downloadCount', downloadCount);

                if (downloadCountText.length)
                {
                    downloadCountText.text(downloadCount);
                }

                if (!hasDownloadedResume)
                {
                    alert('Your resume is downloaded successfully!');
                    hasDownloadedResume = true;
                }
            });
        }
    });

    const defaultSkills = [];

    skillsList.find('li').each(function ()
    {
        defaultSkills.push($(this).clone().children().remove().end().text().trim());
    });

    let skills = defaultSkills.slice();
    const savedSkills = getSavedSkills();

    savedSkills.forEach(function (savedSkill)
    {
        if (!skills.includes(savedSkill))
        {
            skills.push(savedSkill);
        }
    });

    saveSkills(skills);

    function updateSkills(callback)
    {
        callback();
        saveSkills(skills);
        renderSkills();
    }

    function isDuplicateSkill(skillName, ignoreIndex)
    {
        return skills.some(function (skill, index)
        {
            if (ignoreIndex !== undefined && index === ignoreIndex)
            {
                return false;
            }

            return skill.toLowerCase() === skillName.toLowerCase();
        });
    }

    function renderSkills()
    {
        skillsList.empty();

        skills.forEach(function (skill, index)
        {

            const listItem = $('<li class="skillListItem"></li>');
            const skillText = $('<span class="skillText"></span>').text(skill);
            const buttonWrap = $('<span class="skillButtonWrap"></span>');
            const editButton = $('<button type="button" class="btn btn-sm btn-outline-light skillActionBtn">Edit</button>');
            const deleteButton = $('<button type="button" class="btn btn-sm btn-outline-light skillActionBtn">Delete</button>');

            skillText.on('click', function ()
            {
                const updatedSkill = prompt('Edit skill:', skill);

                if (updatedSkill === null)
                {
                    return;
                }

                const trimmedSkill = updatedSkill.trim();

                if (trimmedSkill === '')
                {
                    alert('Skill cannot be empty.');
                    return;
                }

                if (isDuplicateSkill(trimmedSkill, index))
                {
                    alert('That skill already exists.');
                    return;
                }

                updateSkills(function ()
                {
                    skills[index] = trimmedSkill;
                });
            });

            deleteButton.on('click', function ()
            {
                listItem.slideUp(300, function ()
                {
                    updateSkills(function ()
                    {
                        skills.splice(index, 1);
                    });
                });
            });

            editButton.on('click', function ()
            {
                skillText.trigger('click');
            });

            buttonWrap.append(editButton);
            buttonWrap.append(deleteButton);

            listItem.append(skillText);
            listItem.append(buttonWrap);
            listItem.hide();

            skillsList.append(listItem);
            listItem.slideDown(300);
        });
    }

    function addSkill()
    {
        const skill = skillInput.val().trim();

        if (skill === '')
        {
            alert('Please enter a skill.');
            return;
        }

        if (isDuplicateSkill(skill))
        {

            alert('That skill already exists.');
            return;
        }

        updateSkills(function ()
        {
            skills.push(skill);
        });

        skillInput.val('');
    }

    if (addSkillBtn.length && skillInput.length && skillsList.length)
    {
        addSkillBtn.on('click', function ()
        {
            addSkill();
        });

        skillInput.on('keydown', function (event)
        {
            if (event.key === 'Enter')
            {
                event.preventDefault();
                addSkill();
            }

            if (event.key === 'Escape')
            {
                event.preventDefault();
                $('#skillInput').val('');
            }
        });
    }

    renderSkills();

    const navItems =
    [
        { text: 'About me', target: '#bio' },
        { text: 'Education', target: '#education' },
        { text: 'Skills', target: '#skills' },
        { text: 'Experience', target: '#experience' },
        { text: 'Projects', target: '#projects' },
        { text: 'Contact', target: '#contact' }
    ];

    if (navMenu.length)
    {
        navMenu.empty();

        navItems.forEach(function (item)
        {
            const listItem = $('<li class="nav-item"></li>');
            const link = $('<a class="nav-link sidebarLink text-center"></a>');

            link.attr('href', item.target);
            link.text(item.text);

            link.on('click', function (event)
            {
                event.preventDefault();

                $('html, body').animate(
                    {
                        scrollTop: $(item.target).offset().top - 100
                    },
                    500
                );
            });

            listItem.append(link);
            navMenu.append(listItem);
        });
    }

    let sortAscending = true;

    let projects =
    [
        {
            title: 'Gerrymandering detector',
            description: 'This project analyzes the votes of every state and tells you whether or not the votes have been gerrymandered.',
            deadline: new Date('2025-01-01'),
            imageURL: 'Gerrymanderingproject.png',
            features:
            [
                'Fail safes for incorrect state inputs',
                'Creates visual graph showing dem vs rep votes',
                'Warns you if there has been gerrymandering detected'
            ]
        },
        
        {
            title: 'Auto-Schedule',
            description: 'I made this program to run on my place of work\'s servers 24/7, and it reads weather data to automatically schedule me for the best days to work 2 weeks ahead. It labels the dates in the email.',
            deadline: new Date('2025-06-01'),
            imageURL: 'Autoschedule.png',
            features:
            [
                'Automatically begins checking weather every week to build schedule',
                'Sends email to remove/add days',
                'Confirms by replying confirm command'
            ]
        },

        {
            title: 'Multi-Purpose Calculator',
            description: 'Similarly to Wolfram, this calculator I made is to help me with my math course and with calculating large math equations for work with multiple different equations and math concepts.',
            deadline: new Date('2025-10-01'),
            imageURL: 'Multipurposecalc.png',
            features:
            [
                'Uses user friendly interface to choose what to calculate',
                'Fail safes for incorrect variables and values',
                'Uses Python so it can run on mobile devices as well (phone, tablet, etc.)'
            ]
        },

        {
            title: 'Google V2 (Joke)',
            description: 'The better Google',
            deadline: new Date('2026-12-09'),
            imageURL: 'Awesomegoogle.png',
            features:
            [
                'Project deadline: December 9, 2026',
                'Days remaining: ' + remainingDays
            ]
        }
    ];

    function getProjectStatus(deadline)
    {
        const today = new Date();
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const deadlineOnly = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());

        if (deadlineOnly > todayOnly)
        {
            return 'Ongoing';
        }

        if (deadlineOnly < todayOnly)
        {
            return 'Completed';
        }

        return 'Due Today';
    }

    function formatProjectDate(deadline)
    {
        return deadline.toLocaleDateString();
    }

    function renderProjects()
    {
        if (!projectsContainer.length)
        {
            return;
        }

        projectsContainer.empty();

        for (let i = 0; i < projects.length; i++)
        {
            const project = projects[i];
            const status = getProjectStatus(project.deadline);

            const col = $('<div class="col-12 col-xl-6"></div>');
            const card = $('<div class="card portfolioCard projectCard h-100"></div>');
            const body = $('<div class="card-body d-flex flex-column"></div>');
            const title = $('<h3 class="card-title fw-bold"></h3>').text(project.title);
            const description = $('<p class="card-text sectionText"></p>').text(project.description);
            const list = $('<ul class="sectionText"></ul>');

            for (let j = 0; j < project.features.length; j++)
            {
                list.append($('<li></li>').text(project.features[j]));
            }

            list.append($('<li></li>').text('Deadline: ' + formatProjectDate(project.deadline)));
            list.append($('<li></li>').html('Status: <span class="projectStatus">' + status + '</span>'));

            const imageWrap = $('<div class="projectImages mt-auto"></div>');
            const image = $('<img class="img-fluid rounded portfolioImage" alt="Project image">');

            image.attr('src', project.imageURL);
            image.attr('alt', project.title);

            imageWrap.append(image);
            body.append(title);
            body.append(description);
            body.append(list);
            body.append(imageWrap);
            card.append(body);
            col.append(card);
            projectsContainer.append(col);
        }
    }

    renderProjects();

    if (sortProjectsBtn.length)
    {
        sortProjectsBtn.on('click', function ()
        {
            projects.sort(function (a, b)
            {
                if (sortAscending)
                {
                    return a.deadline - b.deadline;
                }

                return b.deadline - a.deadline;
            });

            sortAscending = !sortAscending;
            renderProjects();
        });
    }

    const educationData =
    [
        ['Kingman High School', 'General Ed.', 'General Ed.'],
        ['Northern Arziona University', 'Computer Sciences', 'Bachelor\'s Degree']
    ];

    const experienceData =
    [
        ['TGen', 'Intern Programmer', '3/4 years'],
        ['Google Inc.', 'Intern Software Programmer', 'Current']
    ];

    if (educationTableBody.length)
    {
        educationTableBody.html('');

        for (let i = 0; i < educationData.length; i++)
        {
            const row = $('<tr></tr>');

            for (let j = 0; j < educationData[i].length; j++)
            {
                const cell = $('<td></td>').text(educationData[i][j]);
                row.append(cell);
            }

            educationTableBody.append(row);
        }
    }

    if (experienceTableBody.length)
    {
        experienceTableBody.html('');

        for (let i = 0; i < experienceData.length; i++)
        {
            const row = $('<tr></tr>');

            for (let j = 0; j < experienceData[i].length; j++)
            {
                const cell = $('<td></td>').text(experienceData[i][j]);
                row.append(cell);
            }

            experienceTableBody.append(row);
        }
    }
});
