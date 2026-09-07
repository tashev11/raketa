const tax=require('./tax-rules-2026.js');
function eq(actual,expected,label){if(Math.abs(actual-expected)>0.01)throw new Error(label+': '+actual+' != '+expected)}
function ok(value,label){if(!value)throw new Error(label)}
const C=tax.constants;
ok(tax.psnEligibility(20000000,20000000,15,true).eligible,'ПСН должна быть доступна на границе лимитов');
ok(!tax.psnEligibility(20000001,10000000,0,true).eligible,'ПСН должна блокироваться по доходу 2025');
ok(!tax.psnEligibility(10000000,20000001,0,true).eligible,'ПСН должна блокироваться по доходу 2026');
ok(!tax.psnEligibility(10000000,10000000,16,true).eligible,'ПСН должна блокироваться при 16 работниках');
eq(tax.psnAfterContrib(100000,100000,0).payable,0,'ПСН без работников можно уменьшить до нуля');
eq(tax.psnAfterContrib(100000,100000,1).payable,50000,'ПСН с работниками уменьшается максимум на 50%');
eq(tax.ndfl(2400000),312000,'НДФЛ до 2,4 млн');
eq(tax.ndfl(5000000),702000,'НДФЛ до 5 млн');
eq(tax.ndfl(20000000),3402000,'НДФЛ до 20 млн');
eq(tax.employeeContrib(C.EMPLOYEE_BASE),893700,'Взносы на предельной базе');
eq(tax.employeeContrib(3000000),896871,'Взносы сверх предельной базы');
eq(tax.ipContrib(300000,false).total,57390,'Взносы ИП на пороге 1%');
eq(tax.ipContrib(1300000,false).total,67390,'Взносы ИП с дополнительным 1%');
eq(tax.ipContrib(999999999,false).extra,321818,'Максимум дополнительного взноса ИП');
const p=tax.usnPlan('income',6,[1000000,1000000,1000000,1000000],[0,0,0,0]);
eq(p.annual,240000,'УСН 6% за год');
eq(p.payments[0],60000,'Аванс УСН I квартал');
eq(p.payments[1],60000,'Аванс УСН полугодие');
console.log('tax-rules-2026: OK');
