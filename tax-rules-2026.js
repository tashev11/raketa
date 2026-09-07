(function(root){
'use strict';
const C={VAT_FREE:20000000,VAT5_MAX:272500000,USN_MAX:490500000,PATENT_MAX:20000000,PATENT_EMPLOYEES_MAX:15,NPD_MAX:2400000,AUSN_MAX:60000000,AUSN_EMPLOYEES_MAX:5,IP_FIXED:57390,IP_EXTRA_THRESHOLD:300000,IP_EXTRA_MAX:321818,EMPLOYEE_BASE:2979000};
function ndfl(income){income=Math.max(0,Number(income)||0);const bands=[[0,2400000,.13],[2400000,5000000,.15],[5000000,20000000,.18],[20000000,50000000,.20],[50000000,Infinity,.22]];return bands.reduce((sum,b)=>sum+Math.max(0,Math.min(income,b[1])-b[0])*b[2],0)}
function employeeContrib(gross){gross=Math.max(0,Number(gross)||0);return Math.min(gross,C.EMPLOYEE_BASE)*.30+Math.max(0,gross-C.EMPLOYEE_BASE)*.151}
function ipContrib(base,ausn){if(ausn)return{fixed:0,extra:0,total:0,base:0};base=Math.max(0,Number(base)||0);const extra=Math.min(C.IP_EXTRA_MAX,Math.max(0,base-C.IP_EXTRA_THRESHOLD)*.01);return{fixed:C.IP_FIXED,extra,total:C.IP_FIXED+extra,base}}
function psnEligibility(prevIncome,currentCombinedIncome,employees,activityAllowed){const reasons=[];if(Number(prevIncome)>C.PATENT_MAX)reasons.push('prev_income');if(Number(currentCombinedIncome)>C.PATENT_MAX)reasons.push('current_income');if(Number(employees)>C.PATENT_EMPLOYEES_MAX)reasons.push('employees');if(activityAllowed===false)reasons.push('activity');return{eligible:reasons.length===0,reasons}}
function psnAfterContrib(cost,contribAmount,employees){cost=Math.max(0,Number(cost)||0);contribAmount=Math.max(0,Number(contribAmount)||0);const limit=Number(employees)>0?cost*.5:cost,reduction=Math.min(contribAmount,limit);return{cost,reduction,payable:Math.max(0,cost-reduction)}}
function usnPlan(mode,rate,revenues,expenses){rate=Math.max(0,Number(rate)||0)/100;revenues=revenues||[];expenses=expenses||[];let revenue=0,expense=0,previous=0;const payments=[];for(let i=0;i<4;i++){revenue+=Math.max(0,Number(revenues[i])||0);expense+=Math.max(0,Number(expenses[i])||0);let accrued=mode==='profit'?Math.max(0,revenue-expense)*rate:revenue*rate;if(i===3&&mode==='profit')accrued=Math.max(accrued,revenue*.01);payments.push(Math.max(0,accrued-previous));previous=accrued}return{annual:previous,payments,revenue,expense}}
const api={constants:C,ndfl,employeeContrib,ipContrib,psnEligibility,psnAfterContrib,usnPlan};
root.RKTax2026=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
