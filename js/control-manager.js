/* ========================================================================
 * control-manager.js v1.0.0
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

 +function($){
   "use strict";

    /**
     * controlManager - global static object to handle all major framework functions.
     */
    var controlManager  = {
        controls_: {},
        dataSources_: {},
        modules_: {},
        containers_: {},
        state_: {},
        guid_: function() {
          function s4() {
             return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
             }
             return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
         },
        inherits: function(childCtor, parentCtor) {
      		  /** @constructor */
      		  function tempCtor() {}
      		  tempCtor.prototype = parentCtor.prototype;
      		  childCtor.superClass_ = parentCtor.prototype;
      		  childCtor.prototype = new tempCtor();
      		  /** @override */
      		  childCtor.prototype.constructor = childCtor;
      	  	childCtor.base = function(me, methodName, var_args) {
      	    	var args = new Array(arguments.length - 2);
      	    	for (var i = 2; i < arguments.length; i++) {
      	      		args[i - 2] = arguments[i];
      	    	}
      	    	return parentCtor.prototype[methodName].apply(me, args);
      	  	};
      	},

        /**
         *
         *
         * registerControl - method to register a control. Control will be
         * registered only one time.
         *
         * @param  {string} name  Is a tag name or Json node name example
         * "ad-text";
         * @param  {function} control Constructor of a control. Control object
         * will be instantiated for each occurence of the control in the meta
         * data.
         */
        registerControl: function(name, control){
          this.controls_[name] = control;
        },

        /**
         * registerDataSource - method to register a data source. Data
         * source will be registered only one time.
         *
         * @param  {string} name       description
         * @param  {object} dataSource description
         */
        registerDataSource: function(name, dataSource){
          this.dataSources_[name] = dataSource;
        },
        registerModule: function(name, module){
          this.modules_[name] = module;
        },
        getDataSource: function(name){
          var ds = this.dataSources_[name];
          if(ds){
            return new ds();
          }
        },
        getModule: function(name){
          return this.modules_[name];
        },
        getContainer: function(id){
          return this.containers_[id];
        },
        getControl: function(name){
          var c = this.controls_[name];
          if(!c){
            c = this.resolveTag(name);
          }
          return c;
        },
        resolveTag: function(name){
          var NewClass = function(){
            controlManager.Control.call(this);
          };
          controlManager.inherits(NewClass, controlManager.Control);

          NewClass.prototype.renderDom = function(){
            var ctrl = $('<' + name +/> );
                el;
            for (el in this.attr_) {
              if (object.hasOwnProperty(el)) {
                ctrl.attr(el, this.attr_[el]);
              }
            }
            this.control_ = ctrl;
          };
          return NewClass;
        },
        resolveJson: function(jqObj){
          var obj = {},
              arrObj = [],
              attr = jqObj.attributes,
              tag = jqObj.prop('tagName').toLowerCase(),
              el;

          obj.c = tag;

          for (;el = attr[i++];) {
            if(!$.isArray(el)){
              obj[el.name] = el.value;
            }
          }

          if(jqObj.children().length > 0){
            jqObj.children().each(function(){
              arrObj.push(
                controlManager.resolveJson($(this))
              );
            })
            obj.cs = arrObj;
          }
          return obj;
        },
        /**
         * apply - description
         *
         * @param  {string|object} meta  Meta can be either container id
         * or json object representing the content of the contaiern. I cases
         * of the container id a html markup represents content of the
         * container.
         * @param  {object=} model Represent a model of the container
         * controls.
         * @param  {string=} state State of the control(s) it can be
         * form, edit, or view.
         * @return {type}       description
         */
        apply: function(meta, model, state){
          var id,
              controlObj,

              // json format
              // { contId: "id", controls: [{tag: "name", attribute: "value", attribute: "value"}, ..., ]}
              json,
              content;

          // See if meta is a container id
          if($.type(meta) === 'string'){
            id = meta;

          // Otherwise it is a json meta data to build a container's
          // content.
          } else {
            id = meta.conId;
  					json = meta.controls;
          }

          // Hide container untill it's rendered in full.
          $('#' + id).hide();

          // Make instance of Control object
          controlObj = new controlManager.Control();

          // Add newly created instance to the container
          // collection.
          this.containers_[id] = controlObj;

          // Build container control
          content = controlObj.build(id, json, model, state);

          // Finally inject the content
          // and show the container.
          $('#' + id)
          .replaceWith(content)
          .fadeIn('slow');

        }
    };

    controlManager.Control = function(){};
    controlManager.Control.prototype = {
        init: function(id, json, state, model){
          var $this = this,
              meta;
          $this.id_ = id;
          $this.state_ = state || 'form';
          $this.control_ = undefined,
          $this.attr_ = {},
          $this.built_ = false;
          // Am I a container
          if(json.cs || id && $('#' + id).children().length > 0){
            $this.controls_ = [];
          }
          // Set attributes
          if(json){
            meta = json;
          } else {
            meta = id;
          }
          $this.setAttr_(meta);

          // Set json
          if(!json){
            json = controlManager.resolveJson($('#' + id));
          }
          $this.json_ = json;
        },
        getJson: function(){
          return this.json_;
        },
        set: function(obj){}
        get: function(){},
        show: function() {
          this.control_.show();
        },
        hide: function(){
          this.control_.hide();
        },
        getAttributes: function(){
          return this.attr_;
        },
        setAttr_: function(meta){
          var attr,
              i = 0,
              el;
          if($.type(meta) === 'string'){
            attr = $('#' + meta).attributes,
            for (;el = attr[i++];) {
              if(!$.isArray(el)){
                this.attr_[el.name] = el.value;
              }
            }
          } esle {
            for (el in meta) {
              if (meta.hasOwnProperty(el)) {
                if(!$.isArray(el)){
                  this.attr_[el] = meta[el];
                }
              }
            }
          }
        },
        getId: function(){
          return this.id;
        }
        setState: function(state, model){
          this.state_ = state;
          this.model_ = model;
          this.renderDom();
        },
        getControlById: function(id){
          if(this.controls_){
            return this.controls_[id];
          }
        }
        getControls: function(){
          return this.controls_;
        },
        exec: function(method, par){
          if(this[method]){
            this[method](par);
          }
        },
        renderDom: function(){},
        build: function(id, json, state, model){
          this.init(id, json, state, model);
          var i = 0,
              cntrl,
              tag,
              html = '';

          // Render itself
          this.renderDom();

          // If a container then renders all children
          // and add them to itself
          if(this.controls_){
            if(json){
              for (; tag = json[i++];) {
                cntrl = controlManager.getControl(tag.c);
                cntrl = new cntrl();
                this.controls_.push(cntr);
                this.control_.append(
                  cntrl.build(null, tag, state, model)
                );
              }
            } else {
              $('#' + id).children().each(function(){
                  cntrl = $(this);
                  json = controlManager.resolveJson(cntrl);
                  tag = cntrl.prop('tagName').toLowerCase();
                  cntrl = controlManager.getControl(tag);
                  cntrl = new cntrl();
                  this.control_.append(
                    cntrl.build(json.id, json, state, model)
                  );
              });
            }
          }

          // return control
          // jQuery object
          return this.control_;
        }
    };


    /**
     * Register cm global object.
     */
    window.cm = window.cm || controlManager;

 }(jQuery);
