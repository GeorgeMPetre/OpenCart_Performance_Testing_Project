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

    var data = {"OkPercent": 99.98383446492079, "KoPercent": 0.016165535079211122};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5936156365692582, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.999657651489216, 500, 1500, "POST checkout/shipping_address|save (existing)"], "isController": false}, {"data": [0.5, 500, 1500, "SELECT COUNT(*) AS count_before_cleanup"], "isController": false}, {"data": [0.0010231923601637107, 500, 1500, "06 - Add to Cart"], "isController": true}, {"data": [6.868131868131869E-4, 500, 1500, "11 - Save Payment Methods"], "isController": true}, {"data": [0.0020540910647038686, 500, 1500, "10 - Save Shipping Address "], "isController": true}, {"data": [1.0, 500, 1500, "Get confirm "], "isController": false}, {"data": [6.800408024481469E-4, 500, 1500, "01 - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "POST Add to Cart"], "isController": false}, {"data": [0.9996545768566494, 500, 1500, "Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "SELECT COUNT(*) AS count_after_cleanup"], "isController": false}, {"data": [0.0017088174982911825, 500, 1500, "09 - Save Payment Address"], "isController": true}, {"data": [0.9996584699453552, 500, 1500, "GET Cart"], "isController": false}, {"data": [1.0, 500, 1500, "POST Save Shipping Method"], "isController": false}, {"data": [0.9994891008174387, 500, 1500, "GET Home"], "isController": false}, {"data": [0.0010176390773405698, 500, 1500, "00 - Register"], "isController": true}, {"data": [0.9993164730006835, 500, 1500, "GET Checkout"], "isController": false}, {"data": [1.0, 500, 1500, "GET Set Shipping Address"], "isController": false}, {"data": [0.9991482112436116, 500, 1500, "Search Product"], "isController": false}, {"data": [0.9996549344375432, 500, 1500, "Logout"], "isController": false}, {"data": [3.414134516899966E-4, 500, 1500, "07 - View Cart"], "isController": true}, {"data": [1.0, 500, 1500, "GET payment_address (extract address_id)"], "isController": false}, {"data": [1.0, 500, 1500, "Cleanup all load test data"], "isController": false}, {"data": [1.0, 500, 1500, "GET Category "], "isController": false}, {"data": [3.405994550408719E-4, 500, 1500, "04 - Search"], "isController": true}, {"data": [0.999656121045392, 500, 1500, "POST Save Payment (auto)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Registration Page"], "isController": false}, {"data": [3.4164673727365904E-4, 500, 1500, "08 - Checkout Page"], "isController": true}, {"data": [0.0, 500, 1500, "03 - Browse Category"], "isController": true}, {"data": [0.9989658738366081, 500, 1500, "Post extension/payment/cod/confirm"], "isController": false}, {"data": [0.001034126163391934, 500, 1500, "13 - Logout"], "isController": true}, {"data": [0.0010207553589656345, 500, 1500, "02 - Home"], "isController": true}, {"data": [1.0, 500, 1500, "GET Shipping Methods"], "isController": false}, {"data": [0.9989799387963277, 500, 1500, "Submit Registration"], "isController": false}, {"data": [1.0, 500, 1500, "GET Payment Methods"], "isController": false}, {"data": [0.9998294679399727, 500, 1500, "GET Product"], "isController": false}, {"data": [0.0010221465076660989, 500, 1500, "05 - Product Page"], "isController": true}, {"data": [0.0010316368638239339, 500, 1500, "12 - Confirm Order"], "isController": true}, {"data": [0.9989792446410344, 500, 1500, "Post Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 55674, 9, 0.016165535079211122, 412.60829112332397, 0, 4178253, 71.0, 206.90000000000146, 231.0, 297.0, 3.6427734386501442, 59.28019828005088, 1.877160341364427], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST checkout/shipping_address|save (existing)", 2921, 0, 0.0, 1483.4382060938046, 24, 4178101, 52.0, 71.0, 77.0, 99.0, 0.19213188048042046, 0.2590290272603303, 0.11970716772119948], "isController": false}, {"data": ["SELECT COUNT(*) AS count_before_cleanup", 1, 0, 0.0, 1196.0, 1196, 1196, 1196.0, 1196.0, 1196.0, 1196.0, 0.8361204013377926, 0.014697428929765886, 0.0], "isController": false}, {"data": ["06 - Add to Cart", 2932, 0, 0.0, 13773.459413369686, 0, 4184303, 5068.0, 5939.700000000001, 6130.7, 6399.68, 0.1925820191186916, 0.2145543325223476, 0.09844699670902814], "isController": true}, {"data": ["11 - Save Payment Methods", 2912, 0, 0.0, 27564.217032967033, 0, 4191085, 12097.5, 13376.800000000001, 13736.449999999999, 624241.5299999999, 0.1918617414773723, 0.33278806812109774, 0.19053879800447318], "isController": true}, {"data": ["10 - Save Shipping Address ", 2921, 0, 0.0, 43325.668948990075, 0, 4195856, 16661.0, 18588.2, 19190.5, 739242.2200000001, 0.19213249972867286, 0.3552770609762515, 0.19216949888344773], "isController": true}, {"data": ["Get confirm ", 2905, 0, 0.0, 47.57452667814106, 23, 314, 47.0, 63.0, 70.0, 97.0, 0.1915291629028384, 0.08117544599592956, 0.09052745590329471], "isController": false}, {"data": ["01 - Login", 2941, 3, 0.10200612036722204, 15306.33934036042, 0, 4184993, 6023.0, 6908.6, 7124.0, 7440.58, 0.1925200242754593, 0.1835503052949618, 0.10878251027668093], "isController": true}, {"data": ["Logout-1", 2895, 0, 0.0, 140.33436960276325, 86, 378, 128.0, 201.0, 227.19999999999982, 287.0, 0.1908549431232492, 4.27969844140239, 0.08610838254193469], "isController": false}, {"data": ["POST Add to Cart", 2929, 0, 0.0, 57.157733014680744, 23, 169, 56.0, 77.0, 83.0, 98.0, 0.1926461017446344, 0.21484555487536375, 0.09858062237713713], "isController": false}, {"data": ["Logout-0", 2895, 0, 0.0, 672.7761658031093, 14, 1863239, 29.0, 39.0, 43.0, 57.0, 0.19085578613762014, 0.09896916253816045, 0.0833130238315588], "isController": false}, {"data": ["SELECT COUNT(*) AS count_after_cleanup", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 3.0691964285714284, 0.0], "isController": false}, {"data": ["09 - Save Payment Address", 2926, 0, 0.0, 34898.12781954885, 0, 4191556, 12073.0, 13360.0, 13693.3, 625771.88, 0.19231967499946762, 0.26023200822245485, 0.1211342362986363], "isController": true}, {"data": ["GET Cart", 2928, 0, 0.0, 372.8995901639356, 95, 613351, 153.0, 220.0, 249.0, 315.4200000000001, 0.19257735321896205, 11.188022270188887, 0.0838764643902901], "isController": false}, {"data": ["POST Save Shipping Method", 2912, 0, 0.0, 34.54464285714281, 15, 240, 35.0, 46.0, 51.0, 70.0, 0.1920149476251536, 0.16183862014873773, 0.10013260177171374], "isController": false}, {"data": ["GET Home", 2936, 0, 0.0, 794.6164850136232, 95, 1863332, 149.0, 220.0, 248.1500000000001, 300.2600000000002, 0.19266229632983575, 6.693857015526671, 0.0863593691556588], "isController": false}, {"data": ["00 - Register", 2948, 3, 0.10176390773405698, 28419.51289009499, 0, 4190553, 12379.0, 13643.1, 14016.65, 568386.7799999734, 0.1928363267008452, 5.316150556769922, 0.20260279746524237], "isController": true}, {"data": ["GET Checkout", 2926, 0, 0.0, 628.7546138072455, 98, 722682, 162.0, 233.0, 265.0, 328.46000000000004, 0.1924505452743525, 12.51480545731143, 0.08739209331306047], "isController": false}, {"data": ["GET Set Shipping Address", 50, 0, 0.0, 49.34, 25, 95, 48.0, 66.9, 72.49999999999996, 95.0, 0.08538105565137208, 0.03618689272724168, 0.038188011219070714], "isController": false}, {"data": ["Search Product", 2935, 0, 0.0, 1816.1965928449756, 96, 4178253, 172.0, 251.0, 287.1999999999998, 371.5599999999995, 0.1927738128696323, 6.669722297684705, 0.09356307128535864], "isController": false}, {"data": ["Logout", 2898, 0, 0.0, 812.6708074534158, 102, 1863462, 159.0, 234.0, 262.0, 324.0, 0.19105234240851737, 4.383569640910926, 0.16950703749016555], "isController": false}, {"data": ["07 - View Cart", 2929, 0, 0.0, 14137.973369750745, 0, 4184270, 5917.0, 6927.0, 7148.5, 7562.799999999996, 0.19256900597575352, 11.18371775091679, 0.08384419346262084], "isController": true}, {"data": ["GET payment_address (extract address_id)", 50, 0, 0.0, 57.379999999999995, 28, 101, 58.0, 73.9, 78.79999999999998, 101.0, 0.08539184610339928, 0.036191466024292275, 0.03936030406328561], "isController": false}, {"data": ["Cleanup all load test data", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.0502950643776824, 0.0], "isController": false}, {"data": ["GET Category ", 50, 0, 0.0, 180.60000000000002, 125, 383, 171.5, 227.79999999999998, 285.09999999999974, 383.0, 0.08480167432425785, 3.2344484859509066, 0.039088271758837605], "isController": false}, {"data": ["04 - Search", 2936, 0, 0.0, 11813.428474114475, 0, 4184496, 5678.5, 6790.3, 7057.3, 7477.52, 0.19274592568200283, 6.666486062244887, 0.09351767327422152], "isController": true}, {"data": ["POST Save Payment (auto)", 2908, 0, 0.0, 245.8775790921596, 17, 613302, 35.0, 46.0, 51.0, 71.0, 0.19174165778729602, 0.1614212435193232, 0.09999124443088729], "isController": false}, {"data": ["Get Registration Page", 2945, 0, 0.0, 163.70424448217312, 93, 422, 155.0, 221.0, 247.0, 311.0, 0.19278796269929335, 5.136556627270332, 0.07342510298117617], "isController": false}, {"data": ["08 - Checkout Page", 2927, 0, 0.0, 9512.828151691157, 0, 4184304, 5197.0, 6064.0, 6255.2, 6534.0, 0.19244506817598303, 12.510173768050766, 0.08735974978031873], "isController": true}, {"data": ["03 - Browse Category", 50, 0, 0.0, 5973.4800000000005, 4707, 7397, 6112.0, 6986.4, 7198.35, 7397.0, 0.08393796648524875, 3.2015055218591253, 0.03869015642679434], "isController": true}, {"data": ["Post extension/payment/cod/confirm", 2901, 3, 0.10341261633919338, 55.28679765598068, 16, 178, 54.0, 72.0, 84.0, 120.98000000000002, 0.19125830228160406, 0.17480485161279669, 0.10029854328634902], "isController": false}, {"data": ["13 - Logout", 2901, 0, 0.0, 12677.040675629103, 0, 4183776, 4816.0, 5653.8, 5827.0, 6092.82, 0.19120148880116866, 4.382455003347839, 0.16946393587968106], "isController": true}, {"data": ["02 - Home", 2939, 0, 0.0, 8788.1616195985, 0, 4183778, 4808.0, 5667.0, 5804.0, 6028.4, 0.19280122600325025, 6.6918462692183756, 0.08633342794085339], "isController": true}, {"data": ["GET Shipping Methods", 2915, 0, 0.0, 38.720068610634684, 18, 113, 39.0, 51.0, 57.0, 75.84000000000015, 0.19222215737884152, 0.19293052323003124, 0.09104272102415834], "isController": false}, {"data": ["Submit Registration", 2941, 3, 0.10200612036722204, 206.47806868412127, 30, 407, 203.0, 234.0, 248.0, 295.15999999999985, 0.19251716354990914, 0.183666159748988, 0.12932720486074745], "isController": false}, {"data": ["GET Payment Methods", 2910, 0, 0.0, 38.696563573883104, 19, 151, 39.0, 51.0, 57.0, 76.0, 0.19187360553714258, 0.17161607365744191, 0.09069025886716504], "isController": false}, {"data": ["GET Product", 2932, 0, 0.0, 182.74556616643926, 97, 505, 173.0, 248.0, 277.3499999999999, 351.0, 0.19257988140573593, 6.663018371349742, 0.08970762053763284], "isController": false}, {"data": ["05 - Product Page", 2935, 0, 0.0, 14551.076320272554, 0, 4183939, 5655.0, 6840.8, 7109.0, 7516.199999999999, 0.19271727017267204, 6.660956407817223, 0.0896798592691163], "isController": true}, {"data": ["12 - Confirm Order", 2908, 3, 0.1031636863823934, 18742.62998624481, 0, 4188738, 9416.0, 10570.2, 10910.749999999998, 11645.629999999986, 0.19161267566609289, 0.25583423852559317, 0.19071599697416042], "isController": true}, {"data": ["Post Login", 2939, 3, 0.10207553589656346, 31.212317114664796, 15, 109, 31.0, 41.0, 45.0, 60.0, 0.19287116921206515, 0.18401022446473328, 0.10905508493533762], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /account\\\\/account/", 3, 33.333333333333336, 0.005388511693070374], "isController": false}, {"data": ["Test failed: text expected to contain /&quot;redirect&quot;/", 3, 33.333333333333336, 0.005388511693070374], "isController": false}, {"data": ["Test failed: text expected to contain /checkout\\\\/success/", 3, 33.333333333333336, 0.005388511693070374], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 55674, 9, "Test failed: text expected to contain /account\\\\/account/", 3, "Test failed: text expected to contain /&quot;redirect&quot;/", 3, "Test failed: text expected to contain /checkout\\\\/success/", 3, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Post extension/payment/cod/confirm", 2901, 3, "Test failed: text expected to contain /checkout\\\\/success/", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit Registration", 2941, 3, "Test failed: text expected to contain /&quot;redirect&quot;/", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Post Login", 2939, 3, "Test failed: text expected to contain /account\\\\/account/", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
