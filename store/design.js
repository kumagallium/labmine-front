import moment from '~/plugins/moment'

export const state = () => ({
  types: null,
  nodes: null,
  details: [],
  templates: [],
  template:[],
  plan:null,
  emsg:null
})

export const getters = {
    types: state => state.types,
    nodes: state => state.nodes,
    details: state => state.details,
    templates: state => state.templates,
    template: state => state.template,
    plan: state => state.plan,
    emsg: state => state.emsg
}

export const mutations = {
  addType(state, { type }) {
    type.contents.created_at = moment(type.contents.created_at).format('YYYY/MM/DD HH:mm:ss')
    state.types.push(type)
  },
  addNode(state, { node }) {
    state.nodes.push(node)
  },
  addDetails(state, { details }) {
    state.details = details
  },
  createTemplates(state, { blueprint }) {
    state.templates.push({id:blueprint.id, pk:blueprint.contents.id,flowname:blueprint.contents.template_name, editor:blueprint.contents.editor})
   // {flowname:"test", editor:"testeditor"}],
  },
  clearTypes(state) {
    state.types = []
  },
  clearNodes(state) {
    state.nodes = []
  },
  clearDetails(state) {
    state.details = []
  },
  clearTemplates(state) {
    state.templates = []
  },
  clearTemplate(state) {
    state.template = []
  },
  clearPlan(state) {
    state.plan = null
  },
  pushFigure(state, { input }) {
    state.details.figures.push(input)
  },
  updateFigure(state, { cluster, propnum, input }) {
    state.details.figures.filter(fg => fg.cluster == cluster)[propnum][Object.keys(input)[0]]=Object.values(input)[0]
  },
  updateDetail(state, { input }) {
    state.details[Object.keys(input)[0]]=Object.values(input)[0]
  },
  updateNode(state, { node }) {
    state.nodes = state.nodes.map(p => (p.contents.typeid === node.typeid ? p={"id":p.id,"contents":node} : p))
  },
  setTemplate(state,{template}) {
    state.template = template.flowdata
  },
  setPlan(state,{plan}) {
    state.plan = plan
  },
  setError(state, {emsg}){
    state.emsg = emsg
  }
}

export const actions = {
  async publishType({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const newtype = await this.$axios.$post("/api/v1/types/",{type_name:payload.typename,concept:payload.concept})
                          .catch (error => {
                            commit('setError', { emsg:error.response.data })
                        });
    if (!newtype.id) throw new Error('Bad request')
    
    const types = await this.$axios.$get("/api/v1/types/"+"?concept="+payload.concept)
    commit('clearTypes')
    Object.entries(types || [])
      .forEach(([id, contents]) =>
        commit('addType', {
          type: {
            id,
            contents
          }
        })
      )

    var node_tmp = null
    var typeid = null
    var nodes_tmp = []
    for(var type_tmp of types){
        typeid = type_tmp.pk
        node_tmp = await this.$axios.$get("/api/v1/types/"+typeid+"/nodes/")
                                .catch (error => {
                                commit('setError', { emsg:error.response.data })
                            });
        if (!node_tmp) throw new Error('Bad request')

        var node_name_tmp = []
        var node_id_tmp = []
        var hue = (60 * (Number(typeid)-1))%360 + Number(typeid)
        var color = "hsl(" + hue + ", 100%, 90%)";
        for(var proc of node_tmp){
            node_name_tmp.push(proc.fields.node_name)
            node_id_tmp.push(proc.pk)
        }
        nodes_tmp.push({"typeid":typeid,"node_name":node_name_tmp,"pk":node_id_tmp,"color":color})   
    } 
    
    commit('clearNodes')
    Object.entries(nodes_tmp || [])
    .forEach(([id, contents]) =>
        commit('addNode', {
        node: {
            id,
            contents
        }
        })
    )
  },
  async publishDetail({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)

    const newnode = await this.$axios.$post("/api/v1/types/"+payload.typeid+"/nodes/",{node_name:payload.node_name})
                          .catch (error => {
                            commit('setError', { emsg:error.response.data })
                        });
    if (!newnode.id) throw new Error('Bad request')

    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const details = await this.$axios.$get("/api/v1/nodes/"+newnode.id)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!details) throw new Error('Bad request')
    details["nodeid"] = details["id"]
    details["typeid"] = payload.typeid
    details["type_name"] = payload.type_name
    commit('clearDetails')
    commit('addDetails', {details})

    var node_tmp =  await this.$axios.$get("/api/v1/types/"+payload.typeid+"/nodes/")
                            .catch (error => {
                            commit('setError', { emsg:error.response.data })
                        });
    if (!node_tmp) throw new Error('Bad request')

    var node_name_tmp = []
    var node_id_tmp = []
    var hue = (60 * (Number(payload.typeid)-1))%360 + Number(payload.typeid)
    var color = "hsl(" + hue + ", 100%, 90%)";
    for(var proc of node_tmp){
        node_name_tmp.push(proc.fields.node_name)
        node_id_tmp.push(proc.pk)
    }
    commit('updateNode',{node:{"typeid":payload.typeid,"node_name":node_name_tmp,"pk":node_id_tmp,"color":color}})
  },
  async publishProperty({ rootState, commit }, { nodeid, payload }) {
    var property_x_id = ""
    var property_y_id = ""
    var property_z_id = ""
    if(payload.property_x.id != undefined)property_x_id = payload.property_x.id
    if(payload.property_y.id != undefined)property_y_id = payload.property_y.id
    if(payload.property_z.id != undefined)property_z_id = payload.property_z.id
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const newfigure = await this.$axios.$post("/api/v1/figures/",{figure_name:payload.figure_name,node:nodeid,property_x_id:property_x_id,property_y_id:property_y_id,property_z_id:property_z_id,datatype:payload.datatype,cluster:payload.cluster})
                          .catch (error => {
                            console.log("error.response.data")
                            console.log(error.response)
                            console.log(error.response.data)
                            commit('setError', { emsg:error.response.data })
                        });
    if (!newfigure.id) throw new Error('Bad request')
  },
  async publishExperiment({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    /*var figures = payload.template.filter(temp => temp.type === "CustomFigure")
    var nodeids = []
    for(var fig of figures){
      nodeids.push(fig.id)
    }
    console.log(nodeids)
    */
    const newblueprint = await this.$axios.$post("/api/v1/blueprints/",{flowdata:payload.template})
                          .catch (error => {
                            commit('setError', { emsg:error.response.data })
                        });
    if (!newblueprint.id) throw new Error('Bad request')
    var bpid = newblueprint.id

    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const newtexperiment = await this.$axios.$post("/v1/projects/"+payload.projectid+"/experiments/",{title:payload.recipename,blueprint:bpid})
                          .catch (error => {
                            console.log(error.response.data)
                            commit('setError', { emsg:error.response.data })
                        });
    if (!newtexperiment.id) throw new Error('Bad request')
    return newtexperiment
  },
  async publishTemplate({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    /*var figures = payload.template.filter(temp => temp.type === "CustomFigure")
    var nodeids = []
    for(var fig of figures){
      nodeids.push(fig.id)
    }
    console.log(nodeids)
    */
    const newblueprint = await this.$axios.$post("/api/v1/blueprints/",{flowdata:payload.template})
                          .catch (error => {
                            commit('setError', { emsg:error.response.data })
                        });
    if (!newblueprint.id) throw new Error('Bad request')
    var bpid = newblueprint.id
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const newtemplate = await this.$axios.$post("/api/v1/templates/",{template_name:payload.flowname,blueprint_id:bpid})
                          .catch (error => {
                            console.log(error.response.data)
                            commit('setError', { emsg:error.response.data })
                        });
    if (!newtemplate.id) throw new Error('Bad request')
  },
  async fetchNodes({ rootState, commit} , { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const types = await this.$axios.$get("/api/v1/types/"+"?concept="+payload.concept)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!types) throw new Error('Bad request')
    
    var node_tmp = null
    var typeid = null
    var nodes_tmp = []
    for(var type_tmp of types){
        typeid = type_tmp.pk
        this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
        node_tmp = await this.$axios.$get("/api/v1/types/"+typeid+"/nodes/")
                                .catch (error => {
                                commit('setError', { emsg:error.response.data })
                            });
        if (!node_tmp) throw new Error('Bad request')

        var node_name_tmp = []
        var node_id_tmp = []
        var hue = (60 * (Number(typeid)-1))%360 + Number(typeid)
        var color = "hsl(" + hue + ", 100%, 90%)";
        for(var proc of node_tmp){
            node_name_tmp.push(proc.fields.node_name)
            node_id_tmp.push(proc.pk)
        }
        nodes_tmp.push({"typeid":typeid,"node_name":node_name_tmp,"pk":node_id_tmp,"color":color})   
    } 
    
    commit('clearNodes')
    Object.entries(nodes_tmp || [])
    .forEach(([id, contents]) =>
        commit('addNode', {
        node: {
            id,
            contents
        }
        })
    )
  },
  async fetchTypes({ rootState, commit }, {payload}) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const types = await this.$axios.$get("/api/v1/types/"+"?concept="+payload.concept)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!types) throw new Error('Bad request')
    commit('clearTypes')
    Object.entries(types || [])
    .forEach(([id, contents]) =>
        commit('addType', {
        type: {
            id,
            contents
        }
        })
    )
  },
  async fetchBlueprints({ rootState, commit }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const templates = await this.$axios.$get("/api/v1/templates/")
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!templates) throw new Error('Bad request')

    var blueprints = []
    for(var temp of templates){
      var bpid = temp["fields"]["blueprint"]
      var template_name = temp["fields"]["template_name"]
      var editor =  temp["fields"]["editor"]
      var blueprint_tmp = await this.$axios.$get("/api/v1/blueprints/"+String(bpid))
                          .catch (error => {
                          commit('setError', { emsg:error.response.data })
                      })
      blueprint_tmp["template_name"] = template_name
      blueprint_tmp["editor"] = editor
      blueprints.push(blueprint_tmp)
    }
    commit('clearTemplates')
    Object.entries(blueprints || [])
    .forEach(([id, contents]) =>
        commit('createTemplates', {
        blueprint: {
            id,
            contents
        }
        })
    )
  },
  async fetchDetails({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const details = await this.$axios.$get("/api/v1/nodes/"+payload.nodeid)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!details) throw new Error('Bad request')
    const types = await this.$axios.$get("/api/v1/types/"+details["typeid_id"])
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    details["nodeid"] = details["id"]
    details["typeid"] = types["id"]
/*
    if(!payload.notebook){
      if(details.figures.length == 0){
        var input = [{"figure_name": "","property_x": {"property_name":""},"property_y":  {"property_name":""},"property_z":  {"property_name":""},"datatype":0,"cluster":1},
                      {"figure_name": "","property_x": {"property_name":""},"property_y":  {"property_name":""},"property_z":  {"property_name":""},"datatype":0,"cluster":2}]
        details.figures=input
      }
      else{
        if(details.figures.filter(fg => fg["cluster"] == 1).length == 0){
          var input = {"figure_name": "","property_x": {"property_name":""},"property_y":  {"property_name":""},"property_z":  {"property_name":""},"datatype":0,"cluster":1}
          details.figures.push(input)
        }
        if(details.figures.filter(fg => fg["cluster"] == 2).length == 0){
          var input = {"figure_name": "","property_x": {"property_name":""},"property_y":  {"property_name":""},"property_z":  {"property_name":""},"datatype":0,"cluster":2}
          details.figures.push(input)
        }
        /*
        if(details.figures){
          var input = {"figure_name": "","property_x": {"property_name":""},"property_y":  {"property_name":""},"property_z":  {"property_name":""},"datatype":0,"cluster":details.figures[0].cluster == true ? false:true}
          console.log("input",input)
          details.figures.push(input)
        }
      }
    }*/
    commit('clearDetails')
    commit('addDetails', {details})
    details["type_name"] = types["type_name"]
  },
  async editType({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const newtype = await this.$axios.$put(`/api/v1/types/${payload.typeid}`,{type_name:payload.typename})
                      .catch (error => {
                          commit('setError', { emsg:error.response.data })
                      });
    if (!newtype.id) throw new Error('Bad request')

    const types = await this.$axios.$get("/api/v1/types/"+"?concept="+payload.concept)
    commit('clearTypes')
    Object.entries(types || [])
      
      .forEach(([id, contents]) =>
        commit('addType', {
          type: {
            id,
            contents
          }
        })
      )
  },
  async editDetails({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    let form = new FormData
    var is_newimage = false
    if(typeof payload.node_image != "string"){
      form.append('node_image', payload.node_image)
      is_newimage = true
    }
    form.append('node_name', payload.node_name)
    form.append('is_newimage', is_newimage)
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const config = {
        headers: { 'content-type': 'multipart/form-data' }
    }
    var  urls = "/api/v1/nodes/"+payload.nodeid
    const node = await this.$axios.$put(urls,form,config)
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
    if (!node.id) throw new Error('Bad request')

    var node_tmp =  await this.$axios.$get("/api/v1/types/"+payload.typeid+"/nodes/")
                            .catch (error => {
                            commit('setError', { emsg:error.response.data })
                        });
    if (!node_tmp) throw new Error('Bad request')

    var node_name_tmp = []
    var node_id_tmp = []
    var hue = (60 * (Number(payload.typeid)-1))%360 + Number(payload.typeid)
    var color = "hsl(" + hue + ", 100%, 90%)";
    for(var proc of node_tmp){
        node_name_tmp.push(proc.fields.node_name)
        node_id_tmp.push(proc.pk)
    }
    commit('updateNode',{node:{"typeid":payload.typeid,"node_name":node_name_tmp,"pk":node_id_tmp,"color":color}})

    if(Object.keys(payload).indexOf("figures")>=0){
      for(var fig of payload.figures){
        if(Object.keys(fig).indexOf("id")>=0){
          var property_x_id=""
          var property_y_id=""
          var property_z_id=""
          if(fig.property_x.id!=undefined)property_x_id=fig.property_x.id
          if(fig.property_y.id!=undefined)property_y_id=fig.property_y.id
          if(fig.property_z.id!=undefined)property_z_id=fig.property_z.id
          const figures = await this.$axios.$put("/api/v1/figures/"+fig.id,{figure_name:fig.figure_name,node:payload.nodeid,property_x_id:property_x_id,property_y_id:property_y_id,property_z_id:property_z_id,datatype:fig.datatype,cluster:fig.cluster})
                .catch (error => {
                  console.log(error.response.data)
                  commit('setError', { emsg:error.response.data })
              });
          if (!figures.id) throw new Error('Bad request')
        }
      }
    }
  },
  async editBlueprint({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const blueprint = await this.$axios.$put("/api/v1/blueprints/"+payload.flowid,{flowdata:payload.template})
                          .catch (error => {
                            console.log(error.response.data)
                            commit('setError', { emsg:error.response.data })
                        });
    if (!blueprint.id) throw new Error('Bad request')
    var bpid = blueprint.id
    var plan = null
    if(blueprint.flowdata.length > 0){
      if(blueprint.flowdata.filter(fd => fd.cssClass == "PlanFigure").length>0){
        var boxid = blueprint.flowdata.filter(fd => fd.cssClass == "PlanFigure")[0].id
        this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
        const plan_tmp = await this.$axios.$get("/api/v1/blueprints/"+bpid+"/boxes/"+boxid)
                          .catch (error => {
                              commit('setError', { emsg:error.response.data })
                          });
        plan = plan_tmp[0]
      }
    }
    commit('setPlan',{"plan":plan})
  },
  async getBlueprint({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const template = await this.$axios.$get(`/api/v1/blueprints/${payload.templateid}`)
                      .catch (error => {
                          commit('setError', { emsg:error.response.data })
                      });
    if (!template.id) throw new Error('Bad request')
    var bpid = template.id
    var plan = null
    if(template.flowdata.length > 0){
      if(template.flowdata.filter(fd => fd.cssClass == "PlanFigure").length>0){
        var boxid = template.flowdata.filter(fd => fd.cssClass == "PlanFigure")[0].id
        this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
        const plan_tmp = await this.$axios.$get("/api/v1/blueprints/"+bpid+"/boxes/"+boxid)
                          .catch (error => {
                              commit('setError', { emsg:error.response.data })
                          });
        plan = plan_tmp[0]
      }
    }
    commit('setPlan',{"plan":plan})
    commit('setTemplate',{template})
  },
  async removeType({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const results = await this.$axios.$delete(`/api/v1/types/${payload.typeid}`)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data.error })
                    });
    if(!results.length==0) throw new Error('Bad request')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const types = await this.$axios.$get("/api/v1/types/"+"?concept="+payload.concept)
    commit('clearTypes')
    Object.entries(types || [])
      .forEach(([id, contents]) =>
        commit('addType', {
          type: {
            id,
            contents
          }
        })
      )
    
    var node_tmp = null
    var typeid = null
    var nodes_tmp = []
    for(var type_tmp of types){
        typeid = type_tmp.pk
        this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
        node_tmp = await this.$axios.$get("/api/v1/types/"+typeid+"/nodes/")
                                .catch (error => {
                                commit('setError', { emsg:error.response.data })
                            });
        if (!node_tmp) throw new Error('Bad request')

        var node_name_tmp = []
        var node_id_tmp = []
        var hue = (60 * (Number(typeid)-1))%360 + Number(typeid)
        var color = "hsl(" + hue + ", 100%, 90%)";
        for(var proc of node_tmp){
            node_name_tmp.push(proc.fields.node_name)
            node_id_tmp.push(proc.pk)
        }
        nodes_tmp.push({"typeid":typeid,"node_name":node_name_tmp,"pk":node_id_tmp,"color":color})   
    } 
    
    commit('clearNodes')
    Object.entries(nodes_tmp || [])
    .forEach(([id, contents]) =>
        commit('addNode', {
        node: {
            id,
            contents
        }
        })
    )
  },
  async removeDetail({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const results = await this.$axios.$delete(`/api/v1/nodes/${payload.nodeid}`)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data.error })
                    });
    if(!results.length==0) throw new Error('Bad request')

    var node_tmp =  await this.$axios.$get("/api/v1/types/"+payload.typeid+"/nodes/")
                            .catch (error => {
                            commit('setError', { emsg:error.response.data })
                        });
    if (!node_tmp) throw new Error('Bad request')

    var node_name_tmp = []
    var node_id_tmp = []
    var hue = (60 * (Number(payload.typeid)-1))%360 + Number(payload.typeid)
    var color = "hsl(" + hue + ", 100%, 90%)";
    for(var proc of node_tmp){
        node_name_tmp.push(proc.fields.node_name)
        node_id_tmp.push(proc.pk)
    }
    commit('updateNode',{node:{"typeid":payload.typeid,"node_name":node_name_tmp,"pk":node_id_tmp,"color":color}})
  },
  async removeEntity({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    for(let i = 0; i < payload.nodeid.length; i++){
      this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
      const results = await this.$axios.$delete("/api/v1/blueprints/"+payload.flowid+"/boxes/"+payload.boxid[i])
                          .catch (error => {
                          commit('setError', { emsg:error.response.data.error })
                      });
    }
  },
  async removeFigure({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const figure = await this.$axios.$delete("/api/v1/figures/"+payload.figureid)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data.error })
                    });
  }
}