/* ========================================================================
 * ui-builder.js v1.0.0
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
     * uIManger - global static object to handle all major framework functions.
     */
    var uiManager = window.uIManager = {
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

        },
        resolveJson: function(jqObj){

        },
        /**
         * loadContainer - description
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
        loadContainer: function(meta, model, state){
          var containerId,
              containerObj,

              // json format
              // { contId: "id", controls: [{tag: "name", attribute: "value", attribute: "value"}, ..., ]}
              json;

          // See if meta is a container id
          if($.type(meta) === 'string'){
            containerId = meta;

          // Otherwise it is a json meta data to build a container's
          // content.
          } else {
            containerId = meta.conId;
  					json = meta.controls;
          }

          // Hide container untill it's rendered in full.
          $('#' + containerId).hide();

          // Make instance of Container object
          containerObj = new uiManager.Container();

          // Add newly created instance to the container
          // collection.
          this.containers_[containerId] = containerObj;

          // Load all container controls.
          containerObj.load(containerId, json, model, state);

          // Finally show the container.
          $('#' + containerId).fadeIn('slow');

        }
    };


    /**
     * uiManager - description
     *
     * @return {type}  description
     */
    uiManager.Container = function(){};
    uiManager.Container.prototype = {
      init: function(containerId, json, state){
        this.id_ = containerId;
        this.json_ = json;
        this.state_ = state || 'form';
        this.container_ = $('#' + containerId);
        this.controls_ = [];
      },
      load: function(containerId, json, model, state){
        this.init(containerId, json, state);
        var i = 0,
            cntrl,
            tag,
            html = '';

        if(json){
          for (; tag = json[i++];) {
            cntrl = uiManager.getControl(tag.c);
            cntrl = new cntrl();
            this.controls_.push(cntr);
            htm += cntrl.build(null, tag, state, model);
          }
        } else {
          $('#' + containerId).children().each(function(){
  					  cntrl = $(this);
              json = uiManager.resolveJson(cntrl);
  						tag = cntrl.prop('tagName').toLowerCase();
            	cntrl = uiManager.getControl(tag);
  						cntrl = new cntrl(state, model);
              htm += cntrl.build(json.id, json, state, model);
        	});
        }

        this.container_.html(html);
      }
    };

    uiManager.Control = function(){};
    uiManager.Control.prototype = {
        init: function(id, json, state, model){
          // am i a container
          if(json.cs || id && $('#' + id).children().length > 0){
            this.controls_ = [];
          }
        },
        renderDom: function(){

        },
        build: function(id, json, state, model){
          this.init(id, json, state, model);
          var htm = '';
          // Build controls

          if(id){
            
          } else {

          }
        };
    };

    uiManager.ContainerControl = function{};
    uiManager.ContainerControl.prototype = {
      init: function(id, json, model, state){
        this.controls_ = [];
        this.json_ = json;
        this.model = model;
        this.state = state;
      },
      renderDom: function(){

      },
      build: function(id, json, model, state){
        this.init(containerId, json, model, state)

      }
    };

 }(jQuery);
