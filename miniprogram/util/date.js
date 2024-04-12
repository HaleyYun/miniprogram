let currentFirstDate;
export default {
    //当前周7天的日期
    setDate(date) {
        var arr = [];
        var week = date.getDay() - 1;
        date = this.addDate(date, week * -1);
        currentFirstDate = new Date(date);
        for (var i = 0; i < 7; i++) {
            arr.push(this.formatDate(i == 0 ? date : this.addDate(date, 1)));
        }
        return arr;
    },
    addDate(date, n) {
        date.setDate(date.getDate() + n);
        return date;
    },
    formatDate(date) {
        var year = date.getFullYear() + '年';
        var month = (date.getMonth() + 1); //+ '月';
        var day = date.getDate(); //+ '日';
        if(month < 10){
            month = `0${month}月`;
        }else{
            month = `${month}月`;
        }
        if(day < 10){
            day = `0${day}日`;
        }else{
            day = `${day}日`;
        }
        console.log(`${year}${month}${day}`);
        return year + month + day
    },
    //获取时间对象返回上周7天的日期、本周7天的日期、下周七天的日期
    getTime() {
        let obj = {};
        obj.stateWeek = this.setDate(new Date());//当前周7天的日期
        obj.nextWeek = this.setDate(this.addDate(currentFirstDate,7));//下一周七天的日期
        currentFirstDate = null;//清空数据，不然出现变量污染，出现重复日期
        obj.stateWeek = this.setDate(new Date());//当前周7天的日期
        obj.priveWeek = this.setDate(this.addDate(currentFirstDate,-7));//上周七天的日期
        return obj;
    },
    //获取当前时间当前年的第几月的第几周
    getMonthWeek(Y, M, D) {
        var date = new Date(Y, parseInt(M) - 1, D),
            w = date.getDay(),
            d = date.getDate();
        if (w == 0) {
            w = 7;
        }
        var config = {
            getMonth: date.getMonth() + 1,
            getYear: date.getFullYear(),
            getWeek: Math.ceil((d + 6 - w) / 7),
        }
        return `${config.getYear}${config.getMonth}${config.getWeek}`;
    },
}
