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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9719179678396644, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET Category "], "isController": false}, {"data": [0.5, 500, 1500, "SELECT COUNT(*) AS count_before_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "04 - Search"], "isController": true}, {"data": [1.0, 500, 1500, "Get Registration Page"], "isController": false}, {"data": [0.0, 500, 1500, "01 - Login"], "isController": true}, {"data": [1.0, 500, 1500, "POST Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "SELECT COUNT(*) AS count_after_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "03 - Browse Category"], "isController": true}, {"data": [1.0, 500, 1500, "GET Home"], "isController": false}, {"data": [0.0, 500, 1500, "00 - Register"], "isController": true}, {"data": [0.0, 500, 1500, "02 - Home"], "isController": true}, {"data": [1.0, 500, 1500, "Search Product"], "isController": false}, {"data": [1.0, 500, 1500, "Submit Registration"], "isController": false}, {"data": [1.0, 500, 1500, "GET Product"], "isController": false}, {"data": [0.0, 500, 1500, "05 - Product Page"], "isController": true}, {"data": [1.0, 500, 1500, "Post Login"], "isController": false}, {"data": [1.0, 500, 1500, "Cleanup all load test data"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4171, 0, 0.0, 54.39702709182446, 4, 1156, 48.0, 73.0, 81.0, 184.27999999999975, 3.2134275199134663, 6.100024088909322, 1.6415903740857987], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Category ", 20, 0, 0.0, 174.45, 134, 270, 172.0, 216.50000000000009, 267.49999999999994, 270.0, 0.07063019794112974, 2.641093476859781, 0.03255610686348948], "isController": false}, {"data": ["SELECT COUNT(*) AS count_before_cleanup", 1, 0, 0.0, 1156.0, 1156, 1156, 1156.0, 1156.0, 1156.0, 1156.0, 0.8650519031141869, 0.012671658737024222, 0.0], "isController": false}, {"data": ["04 - Search", 20, 0, 0.0, 4523.45, 2785, 6113, 4463.0, 5965.0, 6105.9, 6113.0, 0.06965971230538819, 2.402685245855247, 0.033809450210720626], "isController": true}, {"data": ["Get Registration Page", 20, 0, 0.0, 189.1, 129, 497, 175.5, 208.20000000000002, 482.5999999999998, 497.0, 0.07010656197420079, 1.8684357254276502, 0.026700741376892878], "isController": false}, {"data": ["01 - Login", 20, 0, 0.0, 5121.200000000001, 3855, 6259, 5111.0, 6117.5, 6252.9, 6259.0, 0.06893342754235096, 0.06630803332931222, 0.0389770063935754], "isController": true}, {"data": ["POST Add to Cart", 4028, 0, 0.0, 50.662363455809356, 22, 119, 48.0, 71.0, 76.0, 86.0, 3.1872711720501323, 3.579454929548488, 1.6309864200725286], "isController": false}, {"data": ["SELECT COUNT(*) AS count_after_cleanup", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 5.37109375, 0.0], "isController": false}, {"data": ["03 - Browse Category", 20, 0, 0.0, 4856.45, 3858, 5948, 4695.5, 5809.6, 5941.75, 5948.0, 0.06929190601245869, 2.591050376514894, 0.03193923792761767], "isController": true}, {"data": ["GET Home", 20, 0, 0.0, 158.49999999999997, 100, 253, 151.5, 212.60000000000005, 251.09999999999997, 253.0, 0.07019292525506354, 2.4394097959491665, 0.03146343036335368], "isController": false}, {"data": ["00 - Register", 20, 0, 0.0, 10776.25, 9647, 11952, 10778.5, 11709.400000000001, 11941.25, 11952.0, 0.06740293135348456, 1.8612161005382124, 0.0709442181765485], "isController": true}, {"data": ["02 - Home", 20, 0, 0.0, 3821.2499999999995, 2902, 4743, 3771.5, 4645.1, 4738.15, 4743.0, 0.06917734303660865, 2.404115338519328, 0.03100820356816735], "isController": true}, {"data": ["Search Product", 20, 0, 0.0, 154.85000000000002, 128, 213, 147.0, 207.40000000000006, 212.85, 213.0, 0.07058981318405941, 2.4347660510205524, 0.034260876125466334], "isController": false}, {"data": ["Submit Registration", 20, 0, 0.0, 200.54999999999995, 185, 220, 201.5, 214.9, 219.75, 220.0, 0.06996847920012035, 0.06730366407433451, 0.04699640624398708], "isController": false}, {"data": ["GET Product", 20, 0, 0.0, 171.70000000000002, 136, 250, 161.5, 221.60000000000002, 248.59999999999997, 250.0, 0.07018184115042074, 2.4206943824261162, 0.03269212717651435], "isController": false}, {"data": ["05 - Product Page", 20, 0, 0.0, 4409.5999999999985, 3045, 5733, 4557.0, 5619.1, 5727.45, 5733.0, 0.06947918403646268, 2.3964585102881304, 0.03236481522011005], "isController": true}, {"data": ["Post Login", 20, 0, 0.0, 33.45000000000001, 17, 53, 33.0, 41.0, 52.39999999999999, 53.0, 0.07019538886490546, 0.06752193167180848, 0.03969055678982448], "isController": false}, {"data": ["Cleanup all load test data", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 0.9765625, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4171, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
