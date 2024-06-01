cls
clear

use "C:\Users\s152296\OneDrive - TU Eindhoven\Master DSE\Master thesis 2\stata\flattened_TP_reactionTime.dta", clear

drop if participant == 11
drop if participant == 42

replace version = subinstr(version, "+", "_", .)
encode version, gen(version_num)
sort version_num
drop version

summarize

reshape wide metric, i(participant) j(version_num)
swilk metric*

robvar metric, by(version_num)

// Perform Repeated Measures ANOVA
anova metric participant version_num, repeated(version_num)


