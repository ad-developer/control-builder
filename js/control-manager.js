/* ========================================================================
 * adpresso-ui framework
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
        guid: function() {
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
                var ctrl = $('<' + name + '/>' ),
                    el;
                for (el in this.attr_) {
                  if (this.attr_.hasOwnProperty(el)) {
                    if(el === 'ad_inner_text'){
                      ctrl.text(this.attr_[el]);
                    } else {
                      ctrl.attr(el, this.attr_[el]);
                    }
                  }
                }

                this.control_ = ctrl;
                this.built_ = true;
              };
          return NewClass;
        },
        resolveJson: function(jqObj){
          var obj = {},
              arrObj = [],
              attr = jqObj[0].attributes,
              tag = jqObj.prop('tagName').toLowerCase(),
              i = 0,
              el;

          obj.c = tag;

          for (;el = attr[i++];) {
            tag = el.value;
            // Make sure not to add display: none; as a
            // value of style attribute
            if (el.value.indexOf('display: none;') >= 0){
              tag = tag.replace('display: none;','');
            }
              obj[el.name] = tag;
          }

          // Check if element has an inner text
          tag = jqObj
          .clone()    //clone the element
          .children() //select all the children
          .remove()   //remove all the children
          .end()
          .text()
          .trim();
          if(tag.length){
            obj.ad_inner_text  = tag;
          }


          if(jqObj.children().length > 0){
            jqObj.children().each(function(){
              // Id needs to be added if missing
              if(!$(this).attr('id')){
                $(this).attr('id', controlManager.guid());
              }
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
              tag,
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
            id = meta.id;
  					json = meta;
          }

          // Hide container untill it's rendered in full.
          $('#' + id).hide();
          tag = $('#' + id).prop('tagName').toLowerCase();

          // Make instance of the corresponding
          // container control
          controlObj = controlManager.getControl(tag);
          controlObj = new controlObj();

          // Add newly created instance to the container
          // collection.
          this.containers_[id] = controlObj;

          // Build container control
          content = controlObj.build(id, json, model, state);

          content.show();

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
          $this.model_ = model;
          $this.control_ = undefined,
          $this.attr_ = {},
          $this.built_ = false;
          // Am I a container
          if(json && json.cs || id && $('#' + id).children().length > 0){
            $this.controls_ = [];
          }
          // Set attributes
          if(json){
            meta = json;
          } else {
            meta = id;
          }

          // Set json
          if(!json){
            json = controlManager.resolveJson($('#' + id));
          }
          $this.json_ = json;

          $this.setAttr_(meta);
        },
        getJson: function(){
          return this.json_;
        },
        set: function(obj){},
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
            attr = $('#' + meta)[0].attributes;
            for (;el = attr[i++];) {
              if(!$.isArray(el)){
                this.attr_[el.name] = el.value;
              }
            }
            // Assumption: we add custom attribute ad_inner_text
            // to hold inner text content ( if any ) of the given
            // control.
            attr = $('#' + meta)
            .clone()    //clone the element
            .children() //select all the children
            .remove()   //remove all the children
            .end()
            .text()
            .trim();
            if(attr.length){
              this.attr_.ad_inner_text  = attr;
            }

          } else {
            for (el in meta) {
              if (meta.hasOwnProperty(el)) {
                if(el !== 'cs' && el !== 'c'){
                  this.attr_[el] = meta[el];
                }
              }
            }
          }
        },
        getId: function(){
          return this.id;
        },
        setState: function(state, model){
          this.state_ = state;
          this.model_ = model;
          this.renderDom();
        },
        getControlById: function(id){
          if(this.controls_){
            return this.controls_[id];
          }
        },
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
          var $this = this,
              i = 0,
              cntrl,
              tag,
              html = '';
          if(id instanceof jQuery){
            cntrl = controlManager.guid();
            id.attr('id', cntrl);
            id = cntrl;
            cntrl = undefined;
          }
          $this.init(id, json, state, model);

          // Render itself
          $this.renderDom();

          // If a container then renders all children
          // and add them to itself
          if($this.controls_){
            if(json){
              for (; tag = json.cs[i++];) {
                cntrl = controlManager.getControl(tag.c);
                cntrl = new cntrl();
                $this.controls_.push(cntrl);
                $this.control_.append(
                  cntrl.build(null, tag, state, model)
                );
              }
            } else {
              $('#' + id).children().each(function(){
                  cntrl = $(this);
                  tag = cntrl.prop('tagName').toLowerCase();
                  tag = controlManager.getControl(tag);
                  tag = new tag();
                  id = cntrl.attr('id');
                  if(!id){
                    id  = cntrl;
                  }
                  $this.control_.append(
                    tag.build(cntrl, null, state, model)
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
