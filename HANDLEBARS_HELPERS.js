/******************************************************************************
**  Description:  Define Handlebars helpers for the application
******************************************************************************/

module.exports = {
    'eq': () => {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        return args.every((expression) => {
            return args[0] === args[1]});
    },
    'eq_str_num': (arg1, arg2) => {
        if (arg1 == arg2) {
            return true;
        } 
        else {
            return false;
        }
    },
    'eq_str_num_all_cases': (arg1, arg2) => {
        if (arg1.toLowerCase() == arg2.toLowerCase()) {
            return true;
        } 
        else {
            return false;
        }
    },
    'eq_arr': (a, b) => {
        return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
    },
    'inc': () => {
        const args = Array.prototype.slice.call(arguments, 0, -1);
        let index = args[0];
            return index + 1;
    },
    'dec': (length) => {
        return length - 1;
    },
    'round': (num) => {
        return Math.round(parseFloat(num));
    },
    'capitalize': (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
