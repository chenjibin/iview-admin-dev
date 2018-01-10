/**
 * Created by 陈继斌 on 2018/1/10.
 */
export default {
    methods: {
        returnDateDetail(year, month, mixDate) {
            let tableData = [];
            let allDats = (new Date(year, month + 1, 0)).getDate();
            let n1str = new Date(year, month, 1);
            let firstday = n1str.getDay();
            let lines = Math.ceil((allDats + firstday) / 7); // 表格所需行数
            for (let i = 0; i < lines; i++) {
                tableData[i] = {};
                for (let j = 0; j < 7; j++) {
                    let idx = i * 7 + j;// 单元格自然序列号
                    let dateStr = idx - firstday + 1;// 计算日期
                    if (dateStr <= 0 || dateStr > allDats) {
                        tableData[i]['day' + j] = {};
                        tableData[i]['day' + j]['day'] = '';
                    } else {
                        tableData[i]['day' + j] = {};
                        tableData[i]['day' + j]['day'] = dateStr;
                        tableData[i]['day' + j] = Object.assign({}, mixDate[dateStr - 1] || {}, tableData[i]['day' + j]);
                    }
                }
            }
            return tableData;
        }
    }
};
