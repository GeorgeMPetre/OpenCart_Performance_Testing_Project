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

    var data = {"OkPercent": 99.96944154422063, "KoPercent": 0.03055845577936795};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5899042395224098, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "POST checkout/shipping_address|save (existing)"], "isController": false}, {"data": [0.5, 500, 1500, "SELECT COUNT(*) AS count_before_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "06 - Add to Cart"], "isController": true}, {"data": [0.0, 500, 1500, "11 - Save Payment Methods"], "isController": true}, {"data": [0.002932551319648094, 500, 1500, "10 - Save Shipping Address "], "isController": true}, {"data": [1.0, 500, 1500, "Get confirm "], "isController": false}, {"data": [0.0, 500, 1500, "01 - Login"], "isController": true}, {"data": [0.993503248375812, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.9995162070633768, 500, 1500, "POST Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "SELECT COUNT(*) AS count_after_cleanup"], "isController": false}, {"data": [0.0019464720194647203, 500, 1500, "09 - Save Payment Address"], "isController": true}, {"data": [0.9854439592430859, 500, 1500, "GET Cart"], "isController": false}, {"data": [1.0, 500, 1500, "POST Save Shipping Method"], "isController": false}, {"data": [0.9872350674373795, 500, 1500, "GET Home"], "isController": false}, {"data": [0.0, 500, 1500, "00 - Register"], "isController": true}, {"data": [0.986387943607195, 500, 1500, "GET Checkout"], "isController": false}, {"data": [1.0, 500, 1500, "GET Set Shipping Address"], "isController": false}, {"data": [0.9843146718146718, 500, 1500, "Search Product"], "isController": false}, {"data": [0.9840399002493766, 500, 1500, "Logout"], "isController": false}, {"data": [0.0, 500, 1500, "07 - View Cart"], "isController": true}, {"data": [1.0, 500, 1500, "GET payment_address (extract address_id)"], "isController": false}, {"data": [1.0, 500, 1500, "Cleanup all load test data"], "isController": false}, {"data": [1.0, 500, 1500, "GET Category "], "isController": false}, {"data": [0.0, 500, 1500, "04 - Search"], "isController": true}, {"data": [1.0, 500, 1500, "POST Save Payment (auto)"], "isController": false}, {"data": [0.9880952380952381, 500, 1500, "Get Registration Page"], "isController": false}, {"data": [0.0, 500, 1500, "08 - Checkout Page"], "isController": true}, {"data": [0.0, 500, 1500, "03 - Browse Category"], "isController": true}, {"data": [0.99800796812749, 500, 1500, "Post extension/payment/cod/confirm"], "isController": false}, {"data": [0.0, 500, 1500, "13 - Logout"], "isController": true}, {"data": [0.0, 500, 1500, "02 - Home"], "isController": true}, {"data": [0.9997549019607843, 500, 1500, "GET Shipping Methods"], "isController": false}, {"data": [0.9894686452848253, 500, 1500, "Submit Registration"], "isController": false}, {"data": [0.9997532082922014, 500, 1500, "GET Payment Methods"], "isController": false}, {"data": [0.9869628198937711, 500, 1500, "GET Product"], "isController": false}, {"data": [0.0, 500, 1500, "05 - Product Page"], "isController": true}, {"data": [0.0, 500, 1500, "12 - Confirm Order"], "isController": true}, {"data": [0.9980787704130644, 500, 1500, "Post Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 39269, 12, 0.03055845577936795, 1796.520079451991, 0, 6111915, 104.0, 300.0, 370.0, 574.9900000000016, 3.5097431592675665, 57.23285687118316, 1.8084897152388046], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST checkout/shipping_address|save (existing)", 2051, 0, 0.0, 62.78595806923455, 24, 311, 55.0, 98.0, 119.39999999999986, 177.0, 0.18450712309045023, 0.24867493105384422, 0.11495658645674535], "isController": false}, {"data": ["SELECT COUNT(*) AS count_before_cleanup", 1, 0, 0.0, 1136.0, 1136, 1136, 1136.0, 1136.0, 1136.0, 1136.0, 0.8802816901408451, 0.015473701584507043, 0.0], "isController": false}, {"data": ["06 - Add to Cart", 2067, 0, 0.0, 32719.46589259803, 3579, 6117846, 5057.0, 5945.2, 6148.2, 6527.519999999998, 0.18536653609401232, 0.2067470130440378, 0.09485553214185787], "isController": true}, {"data": ["11 - Save Payment Methods", 2026, 0, 0.0, 68003.0686080948, 9473, 6125622, 12086.5, 13397.3, 13828.25, 1087769.91, 0.18250654086867346, 0.3160440801377573, 0.18092218495596601], "isController": true}, {"data": ["10 - Save Shipping Address ", 2046, 0, 0.0, 81224.41300097751, 0, 6130778, 16591.5, 18611.5, 19321.199999999997, 1092681.63, 0.18402179911799055, 0.3420614491993253, 0.1862803679253242], "isController": true}, {"data": ["Get confirm ", 2011, 0, 0.0, 59.41670810542009, 23, 429, 51.0, 98.0, 120.0, 174.75999999999976, 0.18143484012667419, 0.07689718810056308, 0.08575631115362334], "isController": false}, {"data": ["01 - Login", 2082, 4, 0.19212295869356388, 29480.20797310282, 4555, 6118599, 6010.0, 6936.0, 7120.0, 641441.3300000275, 0.18628603710993227, 0.17772042063825602, 0.10533165574868242], "isController": true}, {"data": ["Logout-1", 2001, 0, 0.0, 203.7676161919041, 87, 804, 177.0, 338.0, 400.0, 528.96, 0.18072181430612305, 4.05247490243867, 0.08153659981389537], "isController": false}, {"data": ["POST Add to Cart", 2067, 0, 0.0, 523.7731011127238, 24, 950499, 59.0, 94.0, 109.0, 170.27999999999975, 0.18545789392508308, 0.20684890823553276, 0.0949022816569761], "isController": false}, {"data": ["Logout-0", 2001, 0, 0.0, 34.56471764117938, 14, 295, 30.0, 55.0, 66.0, 107.92000000000007, 0.18072375664810084, 0.09371515115248198, 0.07889015548994247], "isController": false}, {"data": ["SELECT COUNT(*) AS count_after_cleanup", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 4.296875, 0.0], "isController": false}, {"data": ["09 - Save Payment Address", 2055, 0, 0.0, 62311.800486618, 0, 6125089, 12133.0, 13351.800000000001, 13739.4, 1085600.6400000001, 0.18462717753381036, 0.25216017938911134, 0.11894867720467085], "isController": true}, {"data": ["GET Cart", 2061, 0, 0.0, 3187.96991751577, 93, 6111850, 188.0, 365.79999999999995, 446.7999999999997, 620.3799999999999, 0.1850187424614513, 10.748578711307877, 0.08058433509551491], "isController": false}, {"data": ["POST Save Shipping Method", 2033, 0, 0.0, 42.20118052139693, 17, 270, 36.0, 70.0, 85.0, 130.0, 0.18316518265028398, 0.15439138623946563, 0.09551742885861603], "isController": false}, {"data": ["GET Home", 2076, 0, 0.0, 222.1618497109824, 95, 1062, 192.0, 362.29999999999995, 432.0, 591.46, 0.18593958199599692, 6.460119694155586, 0.08334596497672128], "isController": false}, {"data": ["00 - Register", 2100, 4, 0.19047619047619047, 70150.0719047618, 9765, 6126263, 12514.0, 13815.8, 14238.95, 1087841.34, 0.18762148491148017, 5.1769487016559745, 0.1968373084630334], "isController": true}, {"data": ["GET Checkout", 2057, 0, 0.0, 233.92270296548338, 96, 991, 206.0, 374.20000000000005, 438.0999999999999, 607.0, 0.1848207283859481, 12.018424025753516, 0.08392738154244714], "isController": false}, {"data": ["GET Set Shipping Address", 100, 0, 0.0, 51.420000000000016, 26, 129, 48.0, 75.80000000000001, 89.49999999999989, 128.89999999999995, 0.01491506838036825, 0.006321425465898262, 0.006670997381063143], "isController": false}, {"data": ["Search Product", 2072, 0, 0.0, 244.39623552123547, 99, 974, 219.0, 373.70000000000005, 451.3499999999999, 637.54, 0.18579918533513573, 6.3973605322167, 0.0901779249136352], "isController": false}, {"data": ["Logout", 2005, 0, 0.0, 238.49376558603473, 102, 985, 207.0, 388.4000000000001, 458.0, 615.6800000000012, 0.18108247218306797, 4.155145702439908, 0.1605830705737099], "isController": false}, {"data": ["07 - View Cart", 2061, 0, 0.0, 27826.001455604044, 4235, 6119046, 6006.0, 7009.6, 7240.9, 575987.48, 0.18491276890407826, 10.742422226253513, 0.08053817864376847], "isController": true}, {"data": ["GET payment_address (extract address_id)", 100, 0, 0.0, 53.949999999999996, 26, 143, 52.5, 72.0, 82.89999999999998, 142.6099999999998, 0.014916554556328714, 0.0063220553490690055, 0.0068755993658077665], "isController": false}, {"data": ["Cleanup all load test data", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 0.07145579268292683, 0.0], "isController": false}, {"data": ["GET Category ", 100, 0, 0.0, 206.72999999999996, 117, 490, 184.0, 318.8, 368.5999999999997, 489.4899999999997, 0.014915264147090756, 0.5654190197360267, 0.006875004567799645], "isController": false}, {"data": ["04 - Search", 2072, 0, 0.0, 38065.25868725858, 3703, 6118456, 5755.0, 6902.7, 7188.35, 7609.08, 0.1857155021354594, 6.394479186973697, 0.0901373091419173], "isController": true}, {"data": ["POST Save Payment (auto)", 2015, 0, 0.0, 42.23424317617857, 18, 499, 36.0, 68.0, 84.0, 135.67999999999984, 0.18171957035902195, 0.15299597825957564, 0.09476567796866199], "isController": false}, {"data": ["Get Registration Page", 2100, 0, 0.0, 3131.3866666666613, 93, 6111915, 194.0, 351.0, 428.89999999999964, 583.9299999999985, 0.18772025284309027, 5.001534822576203, 0.07149501817266134], "isController": false}, {"data": ["08 - Checkout Page", 2057, 0, 0.0, 18713.74769081187, 3713, 6118549, 5269.0, 6140.0, 6360.1, 6775.68, 0.1847292409954149, 12.012474832380889, 0.08388583697545696], "isController": true}, {"data": ["03 - Browse Category", 100, 0, 0.0, 67099.28000000001, 4419, 6117268, 5982.0, 7023.9, 7211.75, 6056171.759999969, 0.01489951469300742, 0.564821977618545, 0.006867745053808108], "isController": true}, {"data": ["Post extension/payment/cod/confirm", 2008, 4, 0.199203187250996, 73.46115537848617, 27, 481, 60.0, 128.10000000000014, 158.54999999999995, 243.28000000000065, 0.18125094382728157, 0.16564330985435566, 0.09505054378442403], "isController": false}, {"data": ["13 - Logout", 2005, 0, 0.0, 18928.924688279298, 3488, 6116633, 4895.0, 5733.8, 5935.0, 539799.480000031, 0.18098696298098976, 4.152954133892305, 0.160498373469938], "isController": true}, {"data": ["02 - Home", 2076, 0, 0.0, 24112.002890173437, 3477, 6118092, 4870.5, 5709.5, 5905.0, 574588.87, 0.18587227458957684, 6.457781225406171, 0.08331579495763258], "isController": true}, {"data": ["GET Shipping Methods", 2040, 0, 0.0, 47.19950980392157, 19, 1036, 40.0, 76.0, 91.0, 146.76999999999975, 0.18367877247836506, 0.18431889074948682, 0.08699629360547564], "isController": false}, {"data": ["Submit Registration", 2089, 4, 0.19147917663954045, 246.37051220679712, 42, 879, 223.0, 333.0, 388.5, 555.1999999999998, 0.1868490637913795, 0.1782460805580195, 0.12552122106489297], "isController": false}, {"data": ["GET Payment Methods", 2026, 0, 0.0, 47.95952615992104, 19, 525, 41.0, 79.0, 100.0, 162.0, 0.1826020119749426, 0.16330518271557493, 0.08630798222253147], "isController": false}, {"data": ["GET Product", 2071, 0, 0.0, 240.20183486238523, 98, 1113, 214.0, 373.79999999999995, 437.0, 594.8400000000006, 0.18572553532403724, 6.39493507559684, 0.08651472690387282], "isController": false}, {"data": ["05 - Product Page", 2071, 0, 0.0, 16655.20569773055, 3847, 6117792, 5752.0, 6835.8, 7125.799999999998, 7598.280000000001, 0.18565996829526588, 6.392677459855626, 0.08648418445004084], "isController": true}, {"data": ["12 - Confirm Order", 2011, 4, 0.19890601690701143, 35379.054699154665, 7204, 6122890, 9425.0, 10671.0, 11022.8, 959937.84, 0.18135698856134308, 0.24235716496956747, 0.1806837903601591], "isController": true}, {"data": ["Post Login", 2082, 4, 0.19212295869356388, 36.3117195004803, 15, 279, 32.0, 56.0, 70.0, 115.17000000000007, 0.18639392395199525, 0.17782334673647696, 0.10539265817207544], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /account\\\\/account/", 4, 33.333333333333336, 0.010186151926455982], "isController": false}, {"data": ["Test failed: text expected to contain /&quot;redirect&quot;/", 4, 33.333333333333336, 0.010186151926455982], "isController": false}, {"data": ["Test failed: text expected to contain /checkout\\\\/success/", 4, 33.333333333333336, 0.010186151926455982], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 39269, 12, "Test failed: text expected to contain /account\\\\/account/", 4, "Test failed: text expected to contain /&quot;redirect&quot;/", 4, "Test failed: text expected to contain /checkout\\\\/success/", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Post extension/payment/cod/confirm", 2008, 4, "Test failed: text expected to contain /checkout\\\\/success/", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Submit Registration", 2089, 4, "Test failed: text expected to contain /&quot;redirect&quot;/", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Post Login", 2082, 4, "Test failed: text expected to contain /account\\\\/account/", 4, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
