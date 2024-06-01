clear
cls
set more off

use "C:\Users\s152296\OneDrive - TU Eindhoven\Master DSE\Master thesis 2\resultaten experiment\complete_df_data.dta"

browse

summarize

describe

//create hot encoded dummies

drop if missing(reactiontime_seconds)

tabulate is_detected, generate(is_detected_)
drop is_detected_1
rename is_detected_2 is_detected_dummy

drop if is_detected_dummy == 0


// encode is_detected, gen(is_detected_num)
// encode version, gen(version_num)

tabulate version, generate(version_)
rename version_1 history
rename version_2 historyad
rename version_3 window
rename version_4 windowad


encode pattern, gen(pattern_num)
tabulate pattern_num, generate(pattern_)
rename pattern_1 change_pattern
rename pattern_2 long_pattern
rename pattern_3 short_pattern


//multilevel regression
//mixed is_detected_num version_2 version_3 version_4 version_1 || participant:

mixed reactiontime_seconds window windowad history historyad run_order sequenceid id fp|| participant:


//
// mixed fp historyad window windowad history || participant:
//
// mixed is_detected_dummy long_pattern short_pattern change_pattern || participant:
//
//

//history historyad windowad window 

// corr fp historyad window windowad history
