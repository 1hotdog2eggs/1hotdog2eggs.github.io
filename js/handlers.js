import * as PAINT from './render.js'
import * as GLOBAL from './global.js'
import { GetToken } from './getJWT.js';
// import { setQueryHeader, getQueryData } from './getQueryData.js';

export const handleDataPage = () => {
    //welcome message
    handleWelcomeMessage();
    //logout button
    handleLogoutButton();

    //handle the general-info container
    handleGeneralUserInfo();

    //handle the audit graph
    handleAuditGraph();

    //handle the XP progress graph
    handleProgressGraph();

}

const handleLogoutButton = () => {
    let logoutButton = document.getElementById('logout__button')
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();

        //remove the JWT
        window.JWT = '';

        //redirect to the login page
        PAINT.renderPage(GLOBAL.loginPage)
            .then(GetToken());

    })
}

const handleGeneralUserInfo = () => {
    let lastProjectSubmitted = document.getElementById('last__project__submitted')
    let lastProjectAudited = document.getElementById('last__project__audited')
    let userXp = document.getElementById('total__xp')
    let userLevel = document.getElementById('user__level')

    let lastProjectName = () => {
        let projectProgression = window.queryResult.data.xp_progress

        for (let i = projectProgression.length - 1; i >= 0; i--) {
            if (projectProgression[i].path.split("/").length == 4) {
                return projectProgression[i].path.split('/')[3]
            }
        }
    }

    let lastAuditName = () => {
        let audit = window.queryResult.data.audits_completed[0]
        let auditName = audit.group.path.split('/')[3]
        let auditeeName = audit.group.captainLogin
        return { auditName, auditeeName }
    }

    lastProjectAudited.innerHTML = `
    <p>Last Completed Audit:</p> 
    <em>${lastAuditName().auditName}</em> 
    <p>Captain Name:</p> 
    <em>${lastAuditName().auditeeName}</em>`

    lastProjectSubmitted.innerHTML = `
    <p>Last Submitted Project:</p> 
    <em>${lastProjectName()}</em>`

    userXp.innerHTML = `
    <p>Total XP: </p>
    <em>${window.queryResult.data.total_xp.aggregate.sum.amount / 1000} Kb</em>`

    userLevel.innerHTML = `
    <p>Current lvl: </p>
    <em>${window.queryResult.data.level[0].amount}</em>`

}

const handleWelcomeMessage = () => {
    let welcomeMessage = document.getElementById('welcome__msg')
    welcomeMessage.innerHTML += `<p>Welcome</p><em>${window.queryResult.data.user_info[0].login}!</em>`
}

const handleAuditGraph = () => {

    let auditRatioDown = document.getElementById('audit__ratio__down')
    let auditRatioUp = document.getElementById('audit__ratio__up')
    let ratio = document.getElementById('audit__ratio')
    let ratioText = document.getElementById('ratio__text')

    let graphDown = document.getElementById('graph__down')
    let graphUp = document.getElementById('graph__up')
    let isLowRatio = window.queryResult.data.user_info[0].auditRatio < 1
    let maxBandWidth = 290

    auditRatioDown.textContent = `${Math.floor(window.queryResult.data.audit_ratio_down.aggregate.sum.amount / 1000)}Kb Received`
    auditRatioUp.textContent = `${Math.floor(window.queryResult.data.audit_ratio_up.aggregate.sum.amount / 1000)}Kb Done`
    ratio.textContent = `${(window.queryResult.data.user_info[0].auditRatio).toFixed(1)}`
    ratioText.textContent = !isLowRatio ? 'Keep up the good work!' : `Careful Buddy!`

    graphDown.setAttribute("width", isLowRatio ? `${maxBandWidth}` : `${maxBandWidth / window.queryResult.data.user_info[0].auditRatio}`)
    graphUp.setAttribute("width", isLowRatio ? `${maxBandWidth * window.queryResult.data.user_info[0].auditRatio}` : `${maxBandWidth}`)

    ratio.setAttribute("fill", isLowRatio ? `#c21c1c` : `#01b32d`)
    ratioText.setAttribute("fill", isLowRatio ? `#c21c1c` : `#01b32d`)
    graphDown.setAttribute("fill", isLowRatio ? `#c21c1c` : `black`)
    graphUp.setAttribute("fill", isLowRatio ? `black` : `#01b32d`)
    auditRatioDown.setAttribute("fill", isLowRatio ? `#c21c1c` : `black`)
    auditRatioUp.setAttribute("fill", isLowRatio ? `black` : `#01b32d`)
}

const handleProgressGraph = () => {
    let totalXp = window.queryResult.data.total_xp.aggregate.sum.amount;
    let totalTransactions = window.queryResult.data.xp_progress.length;
    let timeMargin = new Date(window.queryResult.data.xp_progress[totalTransactions - 1].createdAt) - new Date(window.queryResult.data.xp_progress[0].createdAt)

    let [minX, maxX, minY, maxY] = [40, 390, 300, 80];
    let [marginX, marginY] = [maxX - minX, minY - maxY];
    let [coordX, coordY] = [0, 0];
    let xpSum = 0;
    let curveStr = `M 40,300 L`;

    let xpCurve = document.getElementById("xp__progress__curve");
    xpCurve.setAttribute("stroke", "#1ac460")

    window.queryResult.data.xp_progress.forEach(element => {
        let currTimeMargin = new Date(window.queryResult.data.xp_progress[totalTransactions - 1].createdAt) - new Date(element.createdAt)
        xpSum += element.amount
        // <text font-size="11px" stroke-width="0" fill="var(--purple2)" font-family="IBM Plex Mono" text-anchor="middle" opacity="0" x="163.77395833333333" y="150.61157781707934"></text>
        // <circle class="animate-01" fill="var(--purple2)" stroke="var(--purple2)" cx="163.77395833333333" cy="180.61157781707934" r="0.5"></circle>
        coordY = minY - (xpSum / totalXp) * marginY
        coordX = maxX - (currTimeMargin / timeMargin) * marginX

        curveStr += ` ${coordX},${coordY}`
    });

    xpCurve.setAttribute("d", curveStr)

}