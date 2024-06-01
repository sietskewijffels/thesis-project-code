clear
cls
set more off

use "C:\Users\s152296\OneDrive - TU Eindhoven\Master DSE\Master thesis 2\resultaten experiment\complete_df_precision" //complete_df_data  complete_df_precision

summarize

//codebook

describe
//
drop if participant == 11
drop if participant == 42

//create hot encoded dummies

gen is_detected_dummy = .
replace is_detected_dummy = 0 if is_detected == "False"
replace is_detected_dummy = 1 if is_detected == "True"

encode gender, gen(gender_type)
		  
gen experience_order = .
replace experience_order = 0 if experience == "None"
replace experience_order = 1 if experience == "Heard of it"
replace experience_order = 2 if experience == "Somewhat"
replace experience_order = 3 if experience == "Used it several times"
replace experience_order = 4 if experience == "Used it many times"

gen education_order = .
replace education_order = 0 if education == "Highschool"
replace education_order = 1 if education == "Applied university (HBO in Dutch)/ University bachelor"
replace education_order = 2 if education == "University master"
replace education_order = 3 if education == "Doctorate or equivalent"

gen age_order = .
replace age_order = 0 if age == "18-20"
replace age_order = 1 if age == "21-25"
replace age_order = 2 if age == "26-30"
replace age_order = 3 if age == "31-35"

gen centered_sequence_ID = .
replace centered_sequence_ID = sequenceid - 5.5

gen centered_ID = .
replace centered_ID = id - 149.5

// encode is_detected, gen(is_detected_num)
encode version, gen(version_type)

tabulate version, generate(version_)
// rename version_1 history
// rename version_2 historyad
// rename version_3 window
// rename version_4 windowad

encode pattern, gen(pattern_type)
// tabulate pattern_num, generate(pattern_)
// rename pattern_1 change_pattern
// rename pattern_2 long_pattern
// rename pattern_3 short_pattern

gen centered_order = .
replace centered_order = -1.5 if run_order == 1
replace centered_order = -0.5 if run_order == 2
replace centered_order = 0.5 if run_order == 3
replace centered_order = 1.5 if run_order == 4


xtset participant
//multilevel regression demographics
xtlogit is_detected_dummy age_order i.gender_type education_order experience_order

//multiple regression for patterns
xtlogit is_detected_dummy i.pattern_type


// logit is_detected_dummy c.shifted_sequence_ID##c.shifted_ID i.pattern_type c.balanced_order i.version_type
//
// linktest

//multilevl regression 
xtlogit is_detected_dummy centered_order c.centered_ID c.centered_sequence_ID i.pattern_type ib4.version_type
//estimates store model1


// margins, at (centered_order =(-1.5, -0.5, 0.5, 1.5) version_type = (1,2,3,4))
// marginsplot

// // Predict probabilities
// predict double phat

// // Generate ROC curve and plot it
// roctab is_detected_dummy phat, graph


// logit is_detected_dummy shifted_sequence_ID shifted_ID i.pattern_type c.centered_order##i.version_type participant
// linktest


//multilevel regression with interaction
xtlogit is_detected_dummy  centered_ID c.centered_sequence_ID i.pattern_type c.centered_order##i.version_type c.centered_sequence_ID##i.version_type
// estimates store model2
// lrtest model1 model2

stop


xtlogit is_detected_dummy  id c.sequenceid i.pattern_type c.run_order##ib4.version_type
// estimates store model2

margins, at (run_order =(1, 2, 3, 4) version_type = (1,2,3,4))
marginsplot

stop

collin centered_sequence_ID centered_ID pattern_type centered_order version_type

predict double p, xb
predict double res
scatter res p

kdensity res

stop
// //multiple regression for patterns
// mixed is_detected_dummy i.pattern_type|| participant:
//
// //multilevl regression 
// mixed is_detected_dummy balanced_order shifted_ID shifted_sequence_ID i.pattern_type i.version_type || participant:
// estimates store model1
//
// //multilevel regression with interaction
// mixed is_detected_dummy shifted_sequence_ID shifted_ID ib2.pattern_type c.balanced_order##i.version_type || participant:
// estimates store model2
// lrtest model1 model2


//check for normality of residuals
// predict res, residuals
//
// predict fit, fitted
//
// kdensity res
//
// stop
// qnorm res
//
// * Create scatter plot of residuals versus fitted values
// scatter res fit
//
//
// * Check for linearity by creating scatter plots for each category of version_num
// foreach num in 1 2 3 4 {
//     scatter res fit if version_type == `num', title("Residuals vs Fitted Values for version_num == `num'")
// }

  



 
