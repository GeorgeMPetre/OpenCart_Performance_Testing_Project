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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6565138123736673, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9992795389048992, 500, 1500, "POST checkout/shipping_address|save (existing)"], "isController": false}, {"data": [0.5, 500, 1500, "SELECT COUNT(*) AS count_before_cleanup"], "isController": false}, {"data": [0.12205270457697642, 500, 1500, "06 - Add to Cart"], "isController": true}, {"data": [0.0014858841010401188, 500, 1500, "11 - Save Payment Methods"], "isController": true}, {"data": [0.0, 500, 1500, "10 - Save Shipping Address "], "isController": true}, {"data": [1.0, 500, 1500, "Get confirm "], "isController": false}, {"data": [0.14450474898236093, 500, 1500, "01 - Login"], "isController": true}, {"data": [0.9916286149162862, 500, 1500, "Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "POST Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "SELECT COUNT(*) AS count_after_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "09 - Save Payment Address"], "isController": true}, {"data": [0.9936708860759493, 500, 1500, "GET Cart"], "isController": false}, {"data": [1.0, 500, 1500, "POST Save Shipping Method"], "isController": false}, {"data": [0.9870395634379263, 500, 1500, "GET Home"], "isController": false}, {"data": [0.9204851752021563, 500, 1500, "00 - Register"], "isController": true}, {"data": [0.992231638418079, 500, 1500, "GET Checkout"], "isController": false}, {"data": [1.0, 500, 1500, "GET Set Shipping Address"], "isController": false}, {"data": [0.9883081155433288, 500, 1500, "Search Product"], "isController": false}, {"data": [0.989345509893455, 500, 1500, "Logout"], "isController": false}, {"data": [0.11040787623066103, 500, 1500, "07 - View Cart"], "isController": true}, {"data": [1.0, 500, 1500, "GET payment_address (extract address_id)"], "isController": false}, {"data": [1.0, 500, 1500, "Cleanup all load test data"], "isController": false}, {"data": [0.9828767123287672, 500, 1500, "GET Category "], "isController": false}, {"data": [0.07359009628610728, 500, 1500, "04 - Search"], "isController": true}, {"data": [1.0, 500, 1500, "POST Save Payment (auto)"], "isController": false}, {"data": [0.99055330634278, 500, 1500, "Get Registration Page"], "isController": false}, {"data": [0.0882768361581921, 500, 1500, "08 - Checkout Page"], "isController": true}, {"data": [0.08424657534246575, 500, 1500, "03 - Browse Category"], "isController": true}, {"data": [0.9962178517397882, 500, 1500, "Post extension/payment/cod/confirm"], "isController": false}, {"data": [0.08904109589041095, 500, 1500, "13 - Logout"], "isController": true}, {"data": [0.0791268758526603, 500, 1500, "02 - Home"], "isController": true}, {"data": [1.0, 500, 1500, "GET Shipping Methods"], "isController": false}, {"data": [0.9925775978407557, 500, 1500, "Submit Registration"], "isController": false}, {"data": [0.9992559523809523, 500, 1500, "GET Payment Methods"], "isController": false}, {"data": [0.9840720221606648, 500, 1500, "GET Product"], "isController": false}, {"data": [0.08102493074792244, 500, 1500, "05 - Product Page"], "isController": true}, {"data": [0.0, 500, 1500, "12 - Confirm Order"], "isController": true}, {"data": [1.0, 500, 1500, "Post Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15338, 0, 0.0, 122.94732038075348, 0, 1929, 84.0, 247.0, 307.0, 514.2200000000012, 11.081064874584857, 178.6775604925594, 5.618507837633646], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST checkout/shipping_address|save (existing)", 694, 0, 0.0, 54.46253602305477, 22, 553, 49.0, 76.0, 90.25, 217.9999999999991, 0.5129577260746612, 0.6914061749318889, 0.3195967082379237], "isController": false}, {"data": ["SELECT COUNT(*) AS count_before_cleanup", 1, 0, 0.0, 1159.0, 1159, 1159, 1159.0, 1159.0, 1159.0, 1159.0, 0.8628127696289906, 0.014324040120793788, 0.0], "isController": false}, {"data": ["06 - Add to Cart", 721, 0, 0.0, 9267.445214979192, 1043, 280952, 1938.0, 20594.200000000004, 28923.299999999985, 81650.73999999986, 0.5296559587029968, 0.5906905320691623, 0.2710348851175491], "isController": true}, {"data": ["11 - Save Payment Methods", 673, 0, 0.0, 17235.469539375907, 0, 304591, 8185.0, 36974.200000000004, 48530.39999999997, 256286.53999999992, 0.5142873299623187, 0.8916447031079614, 0.5105142338379667], "isController": true}, {"data": ["10 - Save Shipping Address ", 679, 0, 0.0, 26305.32547864505, 3397, 352093, 15986.0, 45296.0, 62493.0, 290953.80000000016, 0.5027354286319303, 1.1414647183293338, 0.7251369414935166], "isController": true}, {"data": ["Get confirm ", 661, 0, 0.0, 54.6293494704992, 23, 442, 47.0, 89.0, 112.89999999999998, 164.51999999999998, 0.509614050236689, 0.21598876738547176, 0.2408722659321851], "isController": false}, {"data": ["01 - Login", 737, 0, 0.0, 8729.629579375858, 1034, 338632, 1826.0, 19563.600000000006, 28793.20000000002, 70536.54000000002, 0.5359836281364496, 0.5113828170794056, 0.30306105536230893], "isController": true}, {"data": ["Logout-1", 657, 0, 0.0, 173.81887366818896, 82, 991, 142.0, 273.0, 346.30000000000007, 741.1199999999985, 0.5073562799432874, 11.376870019587658, 0.22890488411503782], "isController": false}, {"data": ["POST Add to Cart", 721, 0, 0.0, 62.99583911234395, 22, 379, 57.0, 86.0, 105.89999999999998, 197.0, 0.5304177278699571, 0.5915400832299718, 0.27142469668345465], "isController": false}, {"data": ["Logout-0", 657, 0, 0.0, 31.995433789954298, 14, 382, 28.0, 45.0, 57.0, 146.49999999999898, 0.5073907603910848, 0.26310985719498636, 0.22148795888165518], "isController": false}, {"data": ["SELECT COUNT(*) AS count_after_cleanup", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 5.37109375, 0.0], "isController": false}, {"data": ["09 - Save Payment Address", 694, 0, 0.0, 17421.046109510098, 2178, 292311, 10134.5, 35029.5, 47480.5, 264956.7499999999, 0.5119640238306712, 0.9070515344535558, 0.5549610023945752], "isController": true}, {"data": ["GET Cart", 711, 0, 0.0, 193.1026722925456, 94, 1178, 167.0, 291.0, 362.4, 548.0799999999999, 0.5254192823703726, 30.52490069293825, 0.22884472650115836], "isController": false}, {"data": ["POST Save Shipping Method", 679, 0, 0.0, 38.7437407952872, 16, 366, 33.0, 54.0, 69.0, 237.2000000000005, 0.5167801325057748, 0.4355285687035973, 0.26949276441219117], "isController": false}, {"data": ["GET Home", 733, 0, 0.0, 203.78171896316508, 92, 1540, 168.0, 301.20000000000005, 378.89999999999986, 1155.1599999999992, 0.5388374636854424, 18.72197082076597, 0.24152968342931452], "isController": false}, {"data": ["00 - Register", 742, 0, 0.0, 423.8328840970346, 0, 2336, 379.5, 543.0, 670.7, 1290.9000000000035, 0.5411397482460363, 14.914061816282326, 0.5688509680074826], "isController": true}, {"data": ["GET Checkout", 708, 0, 0.0, 202.27966101694875, 97, 1088, 177.0, 302.20000000000005, 371.0999999999999, 539.4599999999998, 0.5234270573344846, 34.03798592933993, 0.23768904459036658], "isController": false}, {"data": ["GET Set Shipping Address", 679, 0, 0.0, 52.07658321060386, 21, 377, 46.0, 74.0, 94.0, 207.4000000000001, 0.5088665690402282, 0.21567196383150297, 0.22759852404338332], "isController": false}, {"data": ["Search Product", 727, 0, 0.0, 224.55158184319112, 101, 1460, 192.0, 342.8000000000002, 426.0, 803.4000000000019, 0.5320464688068547, 18.310726618497068, 0.25822958495801446], "isController": false}, {"data": ["Logout", 657, 0, 0.0, 206.04566210045675, 97, 1159, 171.0, 320.0, 396.0, 919.8199999999991, 0.507344134538089, 11.63968335224934, 0.45036701005383095], "isController": false}, {"data": ["07 - View Cart", 711, 0, 0.0, 9620.756680731367, 1131, 294230, 1973.0, 21049.200000000008, 28264.799999999996, 251489.31999999998, 0.5246624560844242, 30.48093190839696, 0.22851509317739568], "isController": true}, {"data": ["GET payment_address (extract address_id)", 694, 0, 0.0, 55.26368876080691, 22, 419, 49.0, 80.5, 97.5, 176.099999999999, 0.5173810973996009, 0.2192806604213152, 0.2384803495826285], "isController": false}, {"data": ["Cleanup all load test data", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 0.13261959876543208, 0.0], "isController": false}, {"data": ["GET Category ", 730, 0, 0.0, 233.71095890410962, 112, 1929, 201.0, 334.9, 422.1499999999995, 978.3799999999999, 0.5322045736057152, 20.1997963975765, 0.24531304564638431], "isController": false}, {"data": ["04 - Search", 727, 0, 0.0, 9848.642365887215, 1138, 314029, 2072.0, 22251.000000000007, 31655.4, 66443.88000000006, 0.5312952642371783, 18.28487342274002, 0.25786498664636487], "isController": true}, {"data": ["POST Save Payment (auto)", 672, 0, 0.0, 40.63988095238091, 16, 449, 33.0, 56.700000000000045, 76.0, 272.77999999999975, 0.5145781837227894, 0.43317030700102, 0.268344482527314], "isController": false}, {"data": ["Get Registration Page", 741, 0, 0.0, 197.24021592442662, 95, 1292, 164.0, 292.60000000000014, 363.9, 908.0800000000011, 0.5404013847694323, 14.398213848305101, 0.20581693365242054], "isController": false}, {"data": ["08 - Checkout Page", 708, 0, 0.0, 10004.4081920904, 1119, 272683, 2052.5, 20352.7, 29258.399999999965, 250900.53999999986, 0.5227692593954484, 33.995209927068885, 0.2373903375184409], "isController": true}, {"data": ["03 - Browse Category", 730, 0, 0.0, 8852.179452054792, 1162, 262205, 2075.0, 19172.59999999999, 27379.549999999927, 64417.06999999976, 0.5317862481533175, 20.183918877191616, 0.24512022375816986], "isController": true}, {"data": ["Post extension/payment/cod/confirm", 661, 0, 0.0, 68.75340393343426, 27, 901, 53.0, 104.80000000000007, 141.69999999999993, 392.91999999999985, 0.5111458405023921, 0.46721924483421784, 0.26855123260770214], "isController": false}, {"data": ["13 - Logout", 657, 0, 0.0, 8758.088280060885, 1154, 295746, 1999.0, 18251.600000000024, 28027.800000000003, 73863.73999999977, 0.5069444444444444, 11.630513509114584, 0.45001220703125], "isController": true}, {"data": ["02 - Home", 733, 0, 0.0, 8738.083219645283, 1112, 266994, 2042.0, 19384.800000000007, 28722.699999999997, 73037.39999999948, 0.5381621578760729, 18.69850724128203, 0.2412269828760913], "isController": true}, {"data": ["GET Shipping Methods", 679, 0, 0.0, 40.38880706921947, 17, 426, 34.0, 60.0, 76.0, 203.40000000000055, 0.5170524507448525, 0.5190721868805747, 0.24489300645630221], "isController": false}, {"data": ["Submit Registration", 741, 0, 0.0, 227.16464237516874, 165, 1084, 204.0, 280.80000000000007, 344.5999999999999, 750.6200000000139, 0.5403871972719563, 0.5155842692721692, 0.36301496197052446], "isController": false}, {"data": ["GET Payment Methods", 672, 0, 0.0, 42.81249999999999, 18, 516, 36.0, 60.0, 73.70000000000005, 322.0199999999995, 0.5148253615843751, 0.46052737422977297, 0.24333542481136478], "isController": false}, {"data": ["GET Product", 722, 0, 0.0, 227.29362880886427, 97, 1593, 188.5, 343.70000000000005, 440.85, 875.5899999999988, 0.5325233864061973, 18.32891060106918, 0.2480602102692931], "isController": false}, {"data": ["05 - Product Page", 722, 0, 0.0, 8974.062326869796, 1126, 289785, 2056.0, 22572.000000000007, 32511.250000000022, 76425.54999999993, 0.5319701536745359, 18.309868895974045, 0.24780250322534536], "isController": true}, {"data": ["12 - Confirm Order", 661, 0, 0.0, 18979.506807866877, 3098, 329174, 10434.0, 35356.20000000002, 52603.799999999996, 271993.11999999994, 0.5025270802036261, 0.6723262694130544, 0.5015455820001034], "isController": true}, {"data": ["Post Login", 737, 0, 0.0, 31.61872455902307, 15, 202, 29.0, 43.0, 54.200000000000045, 117.48000000000002, 0.5364900592832434, 0.5118660038278603, 0.30334740656738085], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15338, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
