import moment from '~/plugins/moment'
import Cookies from 'universal-cookie'

export const state = () => ({
  notebooks:[],
  entity:[],
  datalist:[],
  selectedtags:[],
  tags:[],
  rawtags:[],
  items:[],
  headlines:[],
  descriptions:[],
  plan_descriptions:[],
  sentences:[],
  plan_sentences:[],
  defaults:[],
  images:[],
  plan_images:[],
  products:[],
  selectedproduct:{},
  data:[],
  summarizeddata:{},
  emsg:null
})

export const getters = {
  notebooks: state => state.notebooks,
  entity: state => state.entity,
  datalist: state => state.datalist,
  selectedtags: state => state.selectedtags,
  tags: state => state.tags,
  rawtags: state => state.rawtags,
  items: state => state.items,
  headlines: state => state.headlines,
  descriptions: state => state.descriptions,
  plan_descriptions: state => state.plan_descriptions,
  plan_sentences: state => state.plan_sentences,
  sentences: state => state.sentences,
  defaults: state => state.defaults,
  images: state => state.images,
  plan_images: state => state.plan_images,
  products: state => state.products,
  selectedproduct: state => state.selectedproduct,
  data: state => state.data,
  summarizeddata: state => state.summarizeddata,
  emsg: state => state.emsg
}

export const mutations = {
  addNotebook(state, { experiment }) {
    state.notebooks.push(experiment)
  },
  setEntity(state, {entity}){
    state.entity = entity
  },
  setItems(state, {items}){
    state.items = items
  },
  setHeadlines(state, {headlines}){
    state.headlines = headlines
  },
  setDescriptions(state, {descriptions}){
    state.descriptions = descriptions
  },
  setPlanDescriptions(state, {plan_descriptions}){
    state.plan_descriptions = plan_descriptions
  },
  setPlanSentences(state, {plan_sentences}){
    state.plan_sentences = plan_sentences
  },
  setSentences(state, {sentences}){
    state.sentences = sentences
  },
  setDefaults(state, {defaults}){
    state.defaults = defaults
  },
  setTags(state, {tags,selectedtags}){
    state.rawtags = tags
    state.tags = tags.map(t => t.fields.tag_name)
    state.selectedtags = selectedtags.map(st => st.fields.tag_name)
  },
  setData(state, {datalist}){
    state.datalist = datalist
  },
  setImages(state, {images}){
    state.images = images
  },
  setPlanImages(state, {plan_images}){
    state.plan_images = plan_images
  },
  setProducts(state, {products}){
    state.products = products
  },
  setSelectedProduct(state, {selectedproduct}){
    state.selectedproduct = selectedproduct
  },
  setexpData(state, {data}){
    state.data = data
  },
  setSummarizedData(state, {summarizeddata}){
    state.summarizeddata = summarizeddata
  },
  setError(state, {emsg}){
    state.emsg = emsg
  },
  clearNotebook(state) {
    state.notebooks = []
  },
  clearPlan(state) {
    state.plan_descriptions = []
    state.plan_sentences = []
    state.plan_images = []
  },
  clearDatalist(state) {
    state.datalist = []
  },
  clearImages(state) {
    state.images = []
  },
  clearEntity(state) {
    state.entity = []
  },
  removeNotebookList(state, {idx}){
    state.notebooks.splice(idx, 1)
  },
}

export const actions = {
  async fetchNotebooks({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    commit('clearNotebook')
    for(var expid of payload["experimentid"]){
      var  urls = "/api/v1/experiments/"+String(expid)
      const experiment = await this.$axios.$get(urls)
                          .catch (error => {
                          commit('setError', { emsg:error.response.data })
                      });
      if (!experiment) throw new Error('Bad request')
      commit('addNotebook',{experiment})
    }
  },
  async fetchData({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+String(payload.entityid)+"/data/"
    const datalist = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!datalist) throw new Error('Bad request')
    commit('setData',{datalist})

  },
  async fetchEntity({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const entity = await this.$axios.$get("/api/v1/blueprints/"+payload.flowid+"/boxes/"+payload.boxid)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data.error })
                    });
    commit('setEntity',{entity})
  },
  async fetchTags({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const tags = await this.$axios.$get("/api/v1/tags/")
                        .catch (error => {
                        commit('setError', { emsg:error.response.data.error })
                    });
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const selectedtags = await this.$axios.$get("/api/v1/experiments/"+payload.experimentid[0]+"/pins/")
                        .catch (error => {
                        commit('setError', { emsg:error.response.data.error })
                    });
    commit('setTags',{tags,selectedtags})
  },
  async fetchItems({ rootState, commit }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const items = await this.$axios.$get("/api/v1/items/")
                        .catch (error => {
                        commit('setError', { emsg:error.response.data.error })
                    });
    commit('setItems',{items})
  },
  async fetchHeadlines({ rootState, commit }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const headlines = await this.$axios.$get("/api/v1/headlines/")
                        .catch (error => {
                        commit('setError', { emsg:error.response.data.error })
                    });
    commit('setHeadlines',{headlines})
  },
  async fetchPlanData({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+String(payload.entityid)+"/descriptions/"
    const plan_descriptions = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!plan_descriptions) throw new Error('Bad request')
    commit('setPlanDescriptions',{plan_descriptions})

    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+String(payload.entityid)+"/sentences/"
    const plan_sentences = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!plan_sentences) throw new Error('Bad request')
    commit('setPlanSentences',{plan_sentences})

    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+String(payload.entityid)+"/images/"
    const plan_images = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!plan_images) throw new Error('Bad request')
    commit('setPlanImages',{plan_images})


  },
  async fetchDescriptions({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+String(payload.entityid)+"/descriptions/"
    const descriptions = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!descriptions) throw new Error('Bad request')
    commit('setDescriptions',{descriptions})
  },
  async fetchSentences({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+String(payload.entityid)+"/sentences/"
    const sentences = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!sentences) throw new Error('Bad request')
    commit('setSentences',{sentences})
  },
  async fetchDefaults({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/nodes/"+String(payload.nodeid)+"/defaults/"
    const defaults = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!defaults) throw new Error('Bad request')
    commit('setDefaults',{defaults})
  },
  async fetchImages({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+String(payload.entityid)+"/images/"
    const images = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!images) throw new Error('Bad request')
    commit('setImages',{images})
  },
  async fetchProducts({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/experiments/"+String(payload.experimentid[0])+"/products/"
    const products = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!products) throw new Error('Bad request')
    commit('setProducts',{products})
  },
  async fetchSelectedProduct({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+ String(payload.entityid) + "/products/"
    const selectedproduct = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!selectedproduct) throw new Error('Bad request')
    commit('setSelectedProduct',{selectedproduct})
  },
  async getData({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/experiments/"+String(payload.experimentid)+"/getdata/"
    const data = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.data })
                    });
    if (!data) throw new Error('Bad request')
    commit('setexpData',{data})
  },
  async getSummarizedData({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/experiments/"+String(payload.experimentid)+"/getsummarizeddata/"
    const summarizeddata = await this.$axios.$get(urls)
                        .catch (error => {
                        commit('setError', { emsg:error.response.summarizeddata })
                    });
    if (!summarizeddata) throw new Error('Bad request')
    commit('setSummarizedData',{summarizeddata})
  },
  async publishImage({ rootState, commit }, { payload }) {
    let form = new FormData
    form.append('image', payload.image)
    form.append('image_name', payload.image_name)
    form.append('cluster', payload.cluster)
    form.append('entity', payload.entityid)
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const config = {
        headers: { 'content-type': 'multipart/form-data' }
    }
    var  urls = "/api/v1/images/"
    const images = await this.$axios.$post(urls,form,config)
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
  },
  async publishPlan({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/blueprints/"+String(payload.blueprintid)+"/boxes/"+String(payload.boxid)
    const plan = await this.$axios.$post(urls)
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
  },
  async publishData({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+String(payload.entityid)+"/data/"
    const datalist = await this.$axios.$post(urls,{"data":payload.data,"figure":payload.figureid,"unit_x":payload.unit_x,"unit_y":payload.unit_y,"unit_z":payload.unit_z})
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
  },
  async publishTags({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/tags/"
    var newtag = await this.$axios.$post(urls,{"tag_name":payload.tag_name})
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
    if (!newtag) throw new Error('Bad request')

    var tagid = newtag.id
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/experiments/"+payload.experimentid[0] + "/tags/"+tagid+"/pins/"
    const newpin = await this.$axios.$post(urls)
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
  },
  async publishProducts({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/experiments/"+payload.experimentid[0] + "/products/"
    const newproduct = await this.$axios.$post(urls,{"product_name":payload.product_name})
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
    return newproduct
  },
  async publishDefinitions({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    var productid = payload.productid
    var entityid = payload.entityid
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+ entityid + "/products/"+productid
    const newdefinitions = await this.$axios.$post(urls)
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
  },
  async publishDescriptions({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    var itemid = payload.itemid
    var entityid = payload.entityid
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+ entityid + "/items/"+itemid+"/descriptions/"
    const newdescriptions = await this.$axios.$post(urls,{"values":payload.values,"cluster":payload.cluster})
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
  },
  async publishSentences({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    var headlineid = payload.headlineid
    var entityid = payload.entityid
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+ entityid + "/headlines/"+headlineid+"/sentences/"
    const newsentences = await this.$axios.$post(urls,{"value":payload.value,"cluster":payload.cluster})
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
  },
  async publishItems({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/items/"
    var newitem = await this.$axios.$post(urls,{"item_name":payload.item_name})
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
    if (!newitem) throw new Error('Bad request')
  
    if(payload.design){
      var itemid = newitem.id
      var nodeid = payload.nodeid
      this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
      var  urls = "/api/v1/nodes/"+ nodeid + "/items/"+itemid+"/defaults/"
      const newdefaults = await this.$axios.$post(urls,{"cluster":payload.cluster})
                          .catch (error => {
                            console.log(error.response.data)
                          commit('setError', { emsg:error.response.data })
                      });
    }
    else{
      var itemid = newitem.id
      var entityid = payload.entityid
      this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
      var  urls = "/api/v1/entities/"+ entityid + "/items/"+itemid+"/descriptions/"
      const newdescriptions = await this.$axios.$post(urls,{"values":[],"cluster":payload.cluster})
                          .catch (error => {
                            console.log(error.response.data)
                          commit('setError', { emsg:error.response.data })
                      });
    }
  },
  async publishHeadlines({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/headlines/"
    var newheadline = await this.$axios.$post(urls,{"headline_name":payload.headline_name})
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
    if (!newheadline) throw new Error('Bad request')
  
    var headlineid = newheadline.id
    var entityid = payload.entityid
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+ entityid + "/headlines/"+headlineid+"/sentences/"
    const newsentences = await this.$axios.$post(urls,{"value":"","cluster":payload.cluster})
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
    return headlineid
  },
  async editExperiment({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    const experiment = await this.$axios.$put("/api/v1/experiments/"+payload.experimentid,{"title":payload.recipename,'blueprint':0})
                          .catch (error => {
                            console.log(error.response.data)
                            commit('setError', { emsg:error.response.data })
                        });
  },
  async editProduct({ rootState, commit }, { payload }) {
    var productid = payload.productid
    var entityid = payload.entityid
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var  urls = "/api/v1/entities/"+ entityid + "/products/"+productid
    const product = await this.$axios.$put(urls,{"product_name":payload.product_name})
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
  },
  async removeTags({ rootState, commit }, { payload }) {
    var tagid = rootState.notebook.rawtags.filter(rt => rt.fields.tag_name == payload.tag_name)[0].pk
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var urls = "/api/v1/experiments/"+payload.experimentid[0] + "/tags/"+tagid+"/pins/"
    var pin = await this.$axios.$delete(urls)
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
                    
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var urls = "/api/v1/tags/"+tagid
    var tag = await this.$axios.$delete(urls)
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
                    
  },
  async removeImages({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var urls = "/api/v1/images/"+payload.imageid
    var image = await this.$axios.$delete(urls)
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
  },
  async removeDefaults({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var urls = "/api/v1/nodes/"+payload.nodeid + "/items/"+payload.itemid+"/defaults/"
    var defaults = await this.$axios.$delete(urls,{data:{"cluster":payload.cluster}})
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
                    
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var urls = "/api/v1/items/"+payload.itemid
    var item = await this.$axios.$delete(urls)
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
  },
  async removeDescriptions({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var urls = "/api/v1/entities/"+payload.entityid + "/items/"+payload.itemid+"/descriptions/"
    var descriptions = await this.$axios.$delete(urls,{data:{"cluster":payload.cluster}})
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
                    
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var urls = "/api/v1/items/"+payload.itemid
    var item = await this.$axios.$delete(urls)
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
                    
  },
  async removeSentences({ rootState, commit }, { payload }) {
    if (!rootState.access) throw new Error('Invalid user')
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var urls = "/api/v1/entities/"+payload.entityid + "/headlines/"+payload.headlineid+"/sentences/"
    var sentences = await this.$axios.$delete(urls,{data:{"cluster":payload.cluster}})
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
                    
    this.$axios.setHeader('Authorization', "Bearer "+rootState.access)
    var urls = "/api/v1/headlines/"+payload.headlineid
    var headline = await this.$axios.$delete(urls)
                        .catch (error => {
                          console.log(error.response.data)
                        commit('setError', { emsg:error.response.data })
                    });
                    
  },
}