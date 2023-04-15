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
function subviewLeftTabsF() {
    var tabList = [{
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content',
        iconSrc: "./assets/icon/resource-management.svg",
        itemList: [{
            title: 'Project',
            name: '1',
            content: 'Project',
            items: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                        label: '三级 1-1-1'
                    }]
                }]
            }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                        label: '三级 2-1-1'
                    }]
                }, {
                    label: '二级 2-2',
                    children: [{
                        label: '三级 2-2-1'
                    }]
                }]
            }]
        }, {
            title: 'Address',
            name: '2',
            content: 'Address'
        }, {
            title: 'Time line',
            name: '3',
            content: 'Time line'
        }]
    }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content',
        iconSrc: "./assets/icon/address-management.svg",
        itemList: [{
            title: 'Project',
            name: '1',
            content: 'Project'
        }, {
            title: 'Address',
            name: '2',
            content: 'Address'
        }]
    }, {
        title: 'Tab 3',
        name: '3',
        content: 'Tab 3 content',
        iconSrc: "./assets/icon/options-management.svg",
        itemList: [{
            title: 'Project',
            name: '1',
            content: 'Project'
        }, {
            title: 'Address',
            name: '2',
            content: 'Address'
        }]
    }]
    return tabList;
}
function subviewRightTabsF() {
    var tabList = [{
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content',
        iconSrc: "./assets/icon/attribute-management.svg",
        itemList: [{
            title: 'Attributes',
            name: '1',
            content: 'Attributes',
            items: [{
                id: 1,
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                id: 2,
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄',
                children: [{
                    id: 21,
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    id: 22,
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }]
            }, {
                id: 3,
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }]
        }, {
            title: 'References',
            name: '2',
            content: 'References'
        }]
    }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content',
        iconSrc: "./assets/icon/reference-management.svg",
        itemList: [{
            title: 'Project',
            name: '1',
            content: 'Project'
        }, {
            title: 'Address',
            name: '2',
            content: 'Address'
        }]
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
        information: '上海市普陀区金沙江路 1518 弄'
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