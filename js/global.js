//this file is reserved for global structures


//should be stored securely instead of using window.JWT
window.JWT = "";
window.queryResult = null;

export const domainName = "https://learn.01founders.co"

export const loginPage = `<main id="login__container">
    <h1 id = "login__header" >01F GraphQL</h1>

<div id="login-error-msg-holder">
    <p id="login-error-msg">Invalid username <span id="error-msg-second-line">and/or password</span></p>
</div>

<form id="login__form">
    <input type="text" name="username" id="username-field" class="login-form-field" placeholder="Username">
    <input type="password" name="password" id="password-field" class="login-form-field" placeholder="Password">
    <input type="submit" value="Login" id="login__form__submit">
</form>

</main>`;

export const dataPage = `<main id="main__holder">
<header>
<a href="https://learn.01founders.co/" title="redirect to 01F"><img class="logo" src="./style/img/01founders.png" alt="FAIL"></a>

<h1 id="welcome__msg"></h1>

<button id="logout__button">Log out</button>


</header>

<div class="general__user__info">
  
  <div class="basic__info">
    <h1>Basic User Info</h1>
    <div id="last__project__submitted"></div>
    <div id="total__xp"></div>
    <div id="user__level"></div>
    <div id="last__project__audited"></div>
  </div>
  
  <div class="user__stats">
  
   <svg id="xp__progress" width="500" height="500">

  <text id="audit__ratio__title" x="215" y="50" text-anchor="middle" style="font-weight:bolder; font-size: 20px;">XP Growth</text>
  <text x="200" y="325" text-anchor="middle" style="font-weight:bolder">Time</text>
  <text x="15" y="100" text-anchor="middle" style="font-weight:bolder">XP</text>

  <line x1="40" y1="300" x2="400" y2="300" stroke="black" />
  <line x1="40" y1="300" x2="40" y2="20" stroke="black" />

  <path id="xp__progress__curve" fill="none" stroke="black" stroke-width="2" />
</svg>



<svg id="audit__ratio__graph" width="500" height="500">

  <rect id="graph__down" x="40" y="115" height="10" />
  <rect id="graph__up" x="40" y="165"  height="10" />

  <text id="audit__ratio__title" x="220" y="50" text-anchor="middle" style="font-weight:bolder; font-size: 23px;">Audit Ratio</text>
  <text id="audit__ratio__down" x="165" y="105" text-anchor="middle" style="font-weight:600; font-size: 16px;"></text>
  <text id="audit__ratio__up" x="165" y="195" text-anchor="middle" style="font-weight:600; font-size: 16px;"></text>
  <text id="audit__ratio" class="ratio" x="110" y="273" text-anchor="middle" style="font-size: 4rem; line-height: 0.9;"></text> 
  <text id="ratio__text" class="ratio" x="250" y="270" text-anchor="middle" style="font-weight: 600; font-size: 16px;" ></text> 


  <line x1="40" y1="300" x2="40" y2="20" stroke="black" />
  <line x1="40" y1="300" x2="400" y2="300" stroke="black" />
  <line x1="400" y1="300" x2="400" y2="20" stroke="black" />
  <line x1="400" y1="20" x2="40" y2="20" stroke="black" />
 
</svg>
  </div>

</div>

</main>`;



export const UserInfoQuery = `
query ($userId: Int!, $rootEventId: Int!) {
  user_info: user {
    login
    auditRatio
  }
  total_xp: transaction_aggregate(
    where: {userId: {_eq: $userId}, type: {_eq: "xp"}, eventId: {_eq: $rootEventId}}
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
  level: transaction(
    limit: 1
    order_by: {amount: desc}
    where: {userId: {_eq: $userId}, type: {_eq: "level"}, eventId: {_eq: $rootEventId}}
  ) {
    amount
  }
  xp_progress: transaction(
    where: {eventId: {_eq: $rootEventId}, type: {_eq: "xp"}}
    order_by: {createdAt: asc}
  ) {
    amount
    path
    type
    userLogin
    createdAt
  }
  project_progress: object(
    where: {type: {_eq: "project"}, progresses: {isDone: {_eq: true}}}
  ) {
    id
    type
    name
    progresses {
      isDone
      grade
    }
  }
  audits_completed: audit(
    where: {grade: {_neq: 0}, auditor: {id: {_eq: $userId}}}
    order_by: {endAt: desc_nulls_last, createdAt: asc}
  ) {
    auditorLogin
    group {
      path
      captainLogin
    }
    grade
    id
    endAt
  }
  audit_ratio_down: transaction_aggregate(
    where: {userId: {_eq: $userId}, type: {_eq: "down"}, eventId: {_eq: $rootEventId}}
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
   audit_ratio_up: transaction_aggregate(
    where: {userId: {_eq: $userId}, type: {_eq: "up"}, eventId: {_eq: $rootEventId}}
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
}

`;


export const queryVariables =
{
  rootEventId: 134,
  userId: 3135

}
