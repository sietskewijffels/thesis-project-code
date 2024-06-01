cls
clear

use "C:\Users\s152296\OneDrive - TU Eindhoven\Master DSE\Master thesis 2\stata\flattened_df", clear //TP_reactionTime

drop if participant == 11
drop if participant == 42

replace version = subinstr(version, "+", "_", .)
encode version, gen(version_num)

mixed metric i.version_num || participant:

//check for normality of residuals
predict res, residuals
predict fit, fitted

kdensity res
qnorm res

* Create scatter plot of residuals versus fitted values
scatter res fit


* Check for linearity by creating scatter plots for each category of version_num
foreach num in 1 2 3 4 {
    scatter res fit if version_num == `num', title("Residuals vs Fitted Values for version_num == `num'")
}



