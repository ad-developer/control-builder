/* ========================================================================
 * control-builder.js v2.0.0
 * ========================================================================
 * Copyright 2017 A. D.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */
(function ($) {
    "use strict";

	var _controls = {},
		_dataSources = {},
		_modules = {},
		_forms = {},
		_state = 'form',
		_guid = function() {
			function s4() {
			    return Math.floor((1 + Math.random()) * 0x10000)
			      .toString(16)
			      .substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
		},

    // controlManager object
    //
    _controlManager = window.controlManager = {
			registerControl: function(name, handler){
				_controls[name] = handler;
			},
			registerDataSource: function(name, handler){
				_dataSources[name] = handler;
			},
      registerModule: function(name, handler){
        _modules[name] = handler;
      },
			// returns instance of a specified
			// data source, otherwise nothing
			getDataSource: function(name){
				var ds = _dataSources[name];
		        if (ds) {
		            return new ds();
		        }
			},
			getModule: function(name){
				return _modules[name];
			},
			getForm: function(name){
				return _forms[name];
			},
			build: function( meta, model){
				var name,
            // json format
            // { form: "name", controls: [{tag: "name", attribute: "value", attribute: "value"}, ..., ]}
            json,
					  obj;

        // See if meta is a string
				if($.type(meta) === 'string'){
					name = meta;
				// else we assume that
				// it is a json object
				// in the form of
				// {form: 'name', meta: {...}}
				} else {
					name = meta.form;
					json = meta.controls;
				}

		    // Hide the form container to prevent
		    // from showing any not rendered
		    // controls and/or elements
		    $('#' + name).hide();

				// Create form object and
				// add it to the form collection
				var form = new Form(name, json);

        // The form does not have yet,
				// setting up a state will not
				// cause any rendering at this
				// point.
				form.setState(_state);
				_forms[name] = form;

        // Loading
        // all form controls
        form.load();

				// Show form container
				$('#' + name).fadeIn('slow');

      },
			// states: form, view, edit
			// model: [optional]
			setState: function(name, state, model){
				if(state !== undefined){
					_state = state;
				}
				if(_forms[name]){
					_forms[name].setState(_state, model);
				}
			}
		};

	// ControlFactory
	//
	var ControlFactory = window.ControlBuilder = function(){};

	ControlFactory.prototype = {
		rendered: false,
		model: null,
		getRawValue: function(){},
		setRawValue: function (value) { },
		hide: function () { },
		show: function () { },
    init: function() {
      var name,
				  value,
				  id,
				  attr = {};

			// Get all attributes
			$.each(htmlControl[0].attributes, function(){
				name = this.name;
				value = this.value;
				if('id' === name){
					id = value
				}
				attr[name] = value;
			});

			// Save id and attributes information
			// into the object variables
			this.attr = attr;

			if(!id){
				id = _guid();
			}
			this.id = id;
      this.render();
    },
		render: function(state, htmlControl, model) { },
		build: function(htmlControl, state, model){
      this.htmlControl = htmlControl;
			this.model = model;
			this.state = state;
      this.init();
			return new Control(this);
		}
	};

	// Form
	//
	var Form = function(){
		this._controls = [];
	};
	Form.prototype = {
    _json: [],
		_rpc: function(url, data, callback){
			 $.ajax({
	            url: url,
	            type: 'POST',
	            data: JSON.stringify(data),
	            contentType: 'application/json; charset=utf-8',
	            dataType: 'json',
	            success: function (result) {
	                callback(result);
	            }
	        });
		},
		addControl: function(control){
    	this._controls.push(control);
		},
		send: function(url, before, after){
			var $this = this,
				data = $this.getData(),
				term = false;
			if(before){
				term = before(data);
			}
			if(!term){
				$this._rpc(url, data, function(result){
					if(after){
						after(result);
					}
				});
			}
		},
    getJson: function(){
        return this._json;
    },
    getData: function(){
			var o = {};
			$.each(this._controls, function(){
				o[this.id] = this.get();
			});
			return o;
		},
    init: function(){

    },
    load: function(){

    },
    // states: form, view, edit
		// model: [optional]
		setState: function(state, model){
			$.each(this._controls, function(i){
				this.setState(state, model);
			});
		},
		getAllControls: function(){
			return this._controls;
		},
		getControlById: function(id){
			for(var i = 0, el; el = this._controls[i++];){
				if(el.id === id){
					return el;
				}
			}
		}
	};

	// Control
	//
	var Control = function(cf){
  	this.attr = cf.attr;
		this.id = cf.id;
		this._cb = cf;
	};

	Control.prototype = {
		id: null,
		_attributes: {},
		_cb: null,
		setState: function(state, model){
			this._cf.render(state, null, model);
		},
		get: function(){
			return this._cb.getRawValue();
		},
		set: function(value){
			this._cb.setRawValue(value);
		},
		getId: function(){
			return this.id;
		},
		getAllAttributes: function(){
			return this._attributes;
		},
		hide: function () {
		    this._cb.hide();
		},
		show: function () {
		    this._cb.show();
		}
	};

  // DataSource
  //
	var DataSource = window.DataSource = function(){};
	DataSource.prototype = {
		// callback signature = function(result){}
		getData: function(par, callback){}
	};

  // Module
  //
	var Module = window.Module = function(){};
	Module.prototype = {
		exec: function(par){
			return res;
		}
	};

})(jQuery);
