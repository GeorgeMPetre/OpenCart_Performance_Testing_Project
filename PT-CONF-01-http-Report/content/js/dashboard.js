/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9727498869289914, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET Category "], "isController": false}, {"data": [0.5, 500, 1500, "SELECT COUNT(*) AS count_before_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "04 - Search"], "isController": true}, {"data": [1.0, 500, 1500, "Get Registration Page"], "isController": false}, {"data": [0.0, 500, 1500, "01 - Login"], "isController": true}, {"data": [1.0, 500, 1500, "POST Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "SELECT COUNT(*) AS count_after_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "03 - Browse Category"], "isController": true}, {"data": [1.0, 500, 1500, "GET Home"], "isController": false}, {"data": [0.0, 500, 1500, "00 - Register"], "isController": true}, {"data": [0.0, 500, 1500, "02 - Home"], "isController": true}, {"data": [1.0, 500, 1500, "Search Product"], "isController": false}, {"data": [1.0, 500, 1500, "Submit Registration"], "isController": false}, {"data": [1.0, 500, 1500, "GET Product"], "isController": false}, {"data": [0.0, 500, 1500, "05 - Product Page"], "isController": true}, {"data": [1.0, 500, 1500, "Post Login"], "isController": false}, {"data": [1.0, 500, 1500, "Cleanup all load test data"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4302, 0, 0.0, 52.759646675964554, 5, 1165, 48.0, 73.0, 79.0, 183.97000000000025, 3.3149554422830194, 6.201231134488019, 1.6935458674306783], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Category ", 20, 0, 0.0, 176.3, 120, 208, 177.0, 200.70000000000002, 207.65, 208.0, 0.07024642445699514, 2.62619413433575, 0.0323792112731462], "isController": false}, {"data": ["SELECT COUNT(*) AS count_before_cleanup", 1, 0, 0.0, 1165.0, 1165, 1165, 1165.0, 1165.0, 1165.0, 1165.0, 0.8583690987124463, 0.0125737660944206, 0.0], "isController": false}, {"data": ["04 - Search", 20, 0, 0.0, 5237.350000000001, 3767, 6283, 5181.0, 6250.2, 6281.5, 6283.0, 0.06904551480335838, 2.409216475813356, 0.033511348493426865], "isController": true}, {"data": ["Get Registration Page", 20, 0, 0.0, 182.10000000000002, 145, 233, 175.5, 215.8, 232.14999999999998, 233.0, 0.07044113762437262, 1.876802302544686, 0.026828167649907544], "isController": false}, {"data": ["01 - Login", 20, 0, 0.0, 4963.700000000001, 3776, 6094, 4881.5, 5849.400000000001, 6082.4, 6094.0, 0.06891015149896808, 0.06574728321727716, 0.03896384542763917], "isController": true}, {"data": ["POST Add to Cart", 4159, 0, 0.0, 49.116133685982135, 22, 159, 48.0, 71.0, 75.0, 83.0, 3.289301978326513, 3.6683426359852325, 1.6831974967217704], "isController": false}, {"data": ["SELECT COUNT(*) AS count_after_cleanup", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 4.296875, 0.0], "isController": false}, {"data": ["03 - Browse Category", 20, 0, 0.0, 4847.1, 3746, 6236, 5028.0, 5711.400000000001, 6210.75, 6236.0, 0.06926838729340704, 2.589629775622376, 0.031928397268054805], "isController": true}, {"data": ["GET Home", 20, 0, 0.0, 158.35000000000002, 112, 212, 156.0, 201.5, 211.5, 212.0, 0.07007782142068766, 2.434862117506491, 0.0314118359688434], "isController": false}, {"data": ["00 - Register", 20, 0, 0.0, 10292.749999999998, 8947, 11534, 10393.0, 11120.7, 11514.15, 11534.0, 0.06761188075968709, 1.8659294436218334, 0.0711740496727585], "isController": true}, {"data": ["02 - Home", 20, 0, 0.0, 3971.55, 2555, 4928, 3944.0, 4807.9, 4922.0, 4928.0, 0.06907174482134593, 2.3999058681627607, 0.0309608699931619], "isController": true}, {"data": ["Search Product", 20, 0, 0.0, 165.69999999999996, 124, 210, 166.5, 188.9, 208.95, 210.0, 0.07029209881663251, 2.4527137363062206, 0.034116379992056994], "isController": false}, {"data": ["Submit Registration", 20, 0, 0.0, 203.1, 183, 241, 202.0, 216.70000000000002, 239.79999999999998, 241.0, 0.07019735987729502, 0.06697541074230198, 0.04716042356209483], "isController": false}, {"data": ["GET Product", 20, 0, 0.0, 157.79999999999998, 117, 187, 161.0, 183.20000000000002, 186.85, 187.0, 0.06990049664302865, 2.439049497415429, 0.03256107119016081], "isController": false}, {"data": ["05 - Product Page", 20, 0, 0.0, 4379.650000000001, 3401, 5569, 4119.5, 5530.400000000001, 5567.55, 5569.0, 0.0689869269773378, 2.4071721611879546, 0.032135511882998166], "isController": true}, {"data": ["Post Login", 20, 0, 0.0, 32.6, 16, 49, 34.5, 43.0, 48.699999999999996, 49.0, 0.06980680965428178, 0.06660278616429033, 0.03947084256819253], "isController": false}, {"data": ["Cleanup all load test data", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 1.0850694444444444, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4302, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
