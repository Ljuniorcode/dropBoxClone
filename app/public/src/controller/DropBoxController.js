class DropBoxController {

  constructor() {
    this.btnSendFileEl = document.querySelector('#btn-send-file') //selecionou o botão
    this.inputFilesEl = document.querySelector('#files') //pega o id do input do botão p/ ler arq.
    this.snackModalEl = document.querySelector('#react-snackbar-root') //barra de progresso

    this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg')//classe da barra de progresso
    this.namefileEl = this.snackModalEl.querySelector('.filename')//nome do arquivo do upload
    this.timeleftEl = this.snackModalEl.querySelector('.timeleft')//tempo 



    this.initEvents();
  }

  //inicializa os eventos de clique e mudança ao selecionar os arquivos
  initEvents() {
    //add evento de click no botão
    this.btnSendFileEl.addEventListener('click', event => {
      this.inputFilesEl.click()
    })

    //add evento de mudança nos arquivos alvos
    this.inputFilesEl.addEventListener('change', event => {

      //seleciona  método que busca vários arquivos qdo clica na tag input
      this.uploadTask(event.target.files)

      this.modalShow()

      this.inputFilesEl.value = ''

    })
  }

  //método que exibe
  modalShow(show = true) {
    snackModalEl.style.display = (show) ? 'block' : 'none'
  }


  //recebe os arquivos para upload
  uploadTask(files) {
    let promises = [];

    //o ...files é usad p/ expandir a qtd de parâmetros, pode ser um ou vários
    [...files].forEach(file => {

      promises.push(new Promise((resolve, reject) => {

        let ajax = new XMLHttpRequest() //criar uma variavel para abrir conexão
        ajax.open('POST', '/upload') //criando requisição usando método post

        //criando evento para saber se deu certo ou n
        ajax.onload = event => {

          this.modalShow(false)

          try {
            resolve(JSON.parse(ajax.responseText))
          } catch (e) {
            reject(e)
          }
        }

        //se der um erro logo de início, esse reject será retornado
        ajax.onerror = event => {

          this.modalShow(false)
          reject(event)
        }

        //trabalhando com a barra de progresso
        ajax.upload.onprogress = event => {
          this.uploadProgress(event, file)

        }

        //método usado p/ enviar arquivos
        let formData = new FormData()

        //input-file é o nome do campo que o POST irá receber
        formData.append('input-file', file) //esse file é do forEach da linha 35

        this.startUploadTime = Date.now()

        ajax.send(formData)//variável tratada e pronto para ser enviado

      }))
    })

    return Promise.all(promises)

  }

  //método da barra de progresso
  uploadProgress(event, file) {
    let timespent = Date.now() - this.startUploadTime

    let loaded = event.loaded
    let total = event.total
    let porcent = parseInt((loaded / total) * 100) //converte em um nº inteiro

    let timeleft = ((100 - porcent) * timespent) / porcent

    this.progressBarEl.style.width = `${porcent}%`

    this.namefileEl.innerHTML = file.name
    this.timeleftEl.innerHTML = this.formatTimeToHuman(timeleft)

    console.log(timespent, timeleft, porcent)
  }

  formatTimeToHuman(duration) {
    let seconds = parseInt((duration / 1000) % 60)
    let minutes = parseInt((duration / (1000 * 60)) % 60)
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24)

    if (hours > 0) {
      return `${hours} horas, ${minutes} minutos e ${seconds} segundos`
    }

    if (minutes > 0) {
      return `${minutes} minutos e ${seconds} segundos`
    }

    if (seconds > 0) {
      return ` ${seconds} segundos`
    }
  }
}

