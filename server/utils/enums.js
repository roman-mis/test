
module.exports = {
    eventType: {
        DPANOTE: 'DPANOTE',
        CALL_LOG: 'CALL_LOG',
        CREATE_TASK: 'CREATE_TASK',
        ONBOARDING: 'ONBOARDING'
    },
    taskCategory: {
        CALL_LOG: 'CALL_LOG',
        TASK: 'TASK'
    },
    templateTypes: {
        CALL_LOG: 'CALL_LOG',
        TASK: 'TASK'
    },
    documentTypes: {
        '1': 'P45',
        '2': 'APP_FORM',
        '3': 'CONTRACT',
        '4': 'ASSIGNMENT_SCHEDULE',
        '5': 'EXPENSE_FORM',
        OTHERS: 'OTHERS'
    },
    codeTypes: {
        'ChangePassword': 'CHPWD',
        'resetPassword': 'RSPWD'
    },
    timesheetStatuses: {
        'Submitted': 'submitted',
        'Payrolled': 'payrolled'
    },
    expenseStatus: {

        'Approve': 'approved',
        'Reject': 'rejected'
    },
    payFrequency: {
        'Weekly': 'weekly',
        'TwoWeekly': 'twoweekly',
        'FourWeekly': 'fourweekly',
        'Monthly': 'monthly'

    },
    statuses: {
        'Submitted': 'submitted',
        'Approved': 'approved',
        'Rejected': 'rejected',
        'Referred': 'referred'
    },
    actionRequestTypes: {
        'SSP': 'ssp',
        'SMP': 'smp',
        'SPP': 'spp',
        'P45': 'p45',
        'HolidayPay': 'holidaypay',
        'SLR': 'studentloan'
    },
    candiateStatus: {

        'Submitted': 'Submitted',
    }
};
