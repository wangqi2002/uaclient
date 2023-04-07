function mainTabsF() {
    var tabList = [{
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content',
        src: "./components/dist/index.html"
    }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content',
        src: "./components/dist/index.html"
    }, {
        title: 'Tab 3',
        name: '3',
        content: 'Tab 3 content',
        src: "./components/dist/index.html"
    }]
    return tabList;
}
function logTableF() {
    var tableData = [{
        timestamp: '2016-05-02',
        source: '王小虎',
        information: '上海市普陀区'
    }, {
        timestamp: '2016-05-02',
        source: '王小虎',
        information: '上海市普陀区金沙江路 1518 弄'
    }, {
        timestamp: '2016-05-02',
        source: '王小虎',
        information: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄'
    }]
    return tableData;
}
function problemTableF() {
    var tableData = [{
        timestamp: '2016-05-02',
        source: '王小虎',
        information: '上海市普陀区'
    }, {
        timestamp: '2016-05-02',
        source: '王小虎',
        information: '上海市普陀区金沙江路 1518 弄'
    }, {
        timestamp: '2016-05-02',
        source: '王小虎',
        information: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄'
    }]
    return tableData;
}
function attributeTableF() {
    var tableData = [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
    }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
    }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        children: [{
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
        }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
        }]
    }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
    }]
    return tableData;
}