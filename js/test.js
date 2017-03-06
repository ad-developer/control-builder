//uIManager.loadContainer('con')

var json = {
  "c":"div",
  "id":"con",
  "class":"ad-container",
  "cs":[
    {"c":"button", "id": "b1", "type":"button","name":"button", "ad_inner_text": "BUtton 1"},
    {"c":"button", "id": "b2", "type":"button","name":"button", "ad_inner_text": "BUtton 2"},
    {"c":"button", "id": "b3", "type":"button","name":"button", "ad_inner_text": "BUtton 3"}
  ]
};

var json2 = {"c":"div","id":"con","class":"ad-container","style":"background: red; width: 300px; ",
"cs":[
  {"c":"button","type":"button","name":"button","id":"test-button","ad_inner_text":"Click Me  One"},
  {"c":"button","type":"button","name":"button","id":"3507a8e6-60fa-90f1-614b-a8e29a893253","ad_inner_text":"Click Me 2"},
  {"c":"button","type":"button","name":"button","id":"0af23392-43a5-eed3-533e-10bd367287a9","ad_inner_text":"Click Me 3"},
  {"c":"div","class":"","ad-test-attribute":"test attribute","id":"1dea65a5-1248-675d-b7b4-ca3f9d39198e",
  "cs":[{"c":"ul",
    "cs":[
      {"c":"li","ad_inner_text":"One"},
      {"c":"li","ad_inner_text":"Two"},
      {"c":"li","ad_inner_text":"Three"},
      {"c":"li","ad_inner_text":"Last Item", cs:[
        {c: "a", href: "http://www.yahoo.com", "ad_inner_text":"Go To Yahoo", target: "_blank", style:"margin-left: 20px;"}
      ]}
    ]},
      {"c":"select","class":"ho-ho","name":"test-select","id":"e6475b42-f0ba-4fb9-bac7-5a5d57450aaf",
        "cs":[
          {"c":"option","value":"1","id":"9e33b33b-2f63-06f9-5d47-8ce546abad99","ad_inner_text":"One"},
          {"c":"option","value":"two2","id":"992020ad-7636-da59-ce91-54d2b325f72b","ad_inner_text":"Two"}]
        }]
      }]
    };
cm.apply(json2);
//cm.apply('con');


$('#getJson').click(function(){
  var c = cm.getContainer('con');
  var json = c.getJson();

  console.log(json);

});
