const main = document.getElementById('main')
const data_container = document.getElementById('data_container')
const list_template = document.getElementById('list_template')
const chemicalName = document.getElementById('chemicalName')
const vendor = document.getElementById('vendor')
const density = document.getElementById('density')
const viscosity = document.getElementById('viscosity')
const packaging = document.getElementById('packaging')
const packSize = document.getElementById('packSize')
const unit = document.getElementById('unit')
const quantity = document.getElementById('quantity')

const deleteRow = document.getElementById("delete")
const refresh = document.getElementById('refresh')

let totaldata;
let count = 1;
let byChemicalName = true;
let byVendor = true;
let byDensity = true;
let byViscosity = true;
let byPackaging = true;
let byPackSize = true;
let byUnit = true;
let byQuntity = true;

let isSelectAll = false;

let forEdit = 0
let editId = 0;

let newObj = {}

let keys = []


let data = []

function setData(item) {
    const template = list_template.content;
    const clone = template.cloneNode(true);

    const tr = clone.querySelector('tr')
    tr.setAttribute('id', item.id)

    const input = clone.querySelector('input')
    input.setAttribute('onclick', `selecctOne(${item.id})`)
    input.classList.add(item.id)

    const sno = clone.querySelector('.sno')
    sno.innerHTML = count++;
    const chemicalName = clone.querySelector(".chemicalName")
    chemicalName.innerHTML = item.chemicalName;
    const vendor = clone.querySelector(".vendor")
    vendor.innerHTML = item.vendor;
    const density = clone.querySelector(".density")
    density.innerHTML = item.density;
    const viscosity = clone.querySelector(".viscosity")
    viscosity.innerHTML = item.viscosity
    const packaging = clone.querySelector(".packaging")
    packaging.innerHTML = item.packaging
    const packSize = clone.querySelector(".packSize")
    packSize.innerHTML = item.packSize
    const unit = clone.querySelector(".unit")
    unit.innerHTML = item.unit
    const quantity = clone.querySelector(".quantity")
    quantity.innerHTML = item.quantity


    data_container.appendChild(clone)
}

function updateInitialy() {
    data_container.innerHTML = ''
    count = 1;
    data.forEach(item => {
        setData(item)
    })
}

async function getData() {
    try {
        const responce = await fetch('list.json')
        data = await responce.json()
        keys = Object.keys(data[0])
        totaldata = data.length;
        updateInitialy()
    } catch (error) {
        console.log(error)
    }
}

getData()


function compareString(by, i) {
    if (by) {
        data = data.slice().sort((a, b) => a[keys[i]].localeCompare(b[keys[i]]))
    } else {
        data = data.slice().sort((a, b) => b[keys[i]].localeCompare(a[keys[i]]))
    }
    updateInitialy()
}

function compareNumbers(by, i) {
    if (by) {
        data = data.slice().sort((a, b) => a[keys[i]] - b[keys[i]])
    } else {
        data = data.slice().sort((a, b) => b[keys[i]] - a[keys[i]])
    }
    updateInitialy()
}

chemicalName.addEventListener('click', () => {
    compareString(byChemicalName, 1)
    byChemicalName = !byChemicalName
})

vendor.addEventListener('click', () => {
    compareString(byVendor, 2)
    byVendor = !byVendor
})

density.addEventListener('click', () => {
    compareNumbers(byDensity, 3)
    byDensity = !byDensity
})

viscosity.addEventListener('click', () => {
    compareNumbers(byViscosity, 4)
    byViscosity = !byViscosity
})

packaging.addEventListener('click', () => {
    compareString(byPackaging, 5)
    byPackaging = !byPackaging
})

packSize.addEventListener('click', () => {
    if (byPackSize) {
        data = data.slice().sort((a, b) => {
            if (a.packSize === "N/A") return -1;
            if (b.packSize === "N/A") return 1;
            return b.packSize - a.packSize
        })
    } else {
        data = data.slice().sort((a, b) => {
            if (b.packSize === "N/A") return -1;
            if (a.packSize === "N/A") return 1;
            return a.packSize - b.packSize
        })
    }
    byPackSize = !byPackSize
    updateInitialy()
})

unit.addEventListener('click', () => {
    compareString(byUnit, 7)
    byUnit = !byUnit
})

quantity.addEventListener('click', () => {
    compareNumbers(byQuntity, 8)
    byQuntity = !byQuntity
})


function selecctOne(i, a = false) {
    const ele = document.getElementById(i);
    let currentColor = ele.style.backgroundColor;
    if (a) {
        currentColor = 'rgb(202, 244, 255)'
    }
    if (!currentColor || currentColor === 'transparent') {
        ele.style.backgroundColor = '#CAF4FF'
        forEdit++;
        editId += i;
    } else if (currentColor === 'rgb(202, 244, 255)') {
        ele.style.backgroundColor = 'transparent'
        forEdit--;
        editId -= i;
    }
}

function selectAll() {
    if (isSelectAll) {
        for (let i = 1; i < count; i++) {
            selecctOne(i, true)
            document.getElementsByClassName(i)[0].checked = false
        }
        isSelectAll = false
    } else {
        for (let i = 1; i < count; i++) {
            selecctOne(i)
            document.getElementsByClassName(i)[0].checked = true
        }
        isSelectAll = true
    }
}


deleteRow.addEventListener('click', () => {
    let selectedFound = false
    if (isSelectAll) {
        data = []
        selectedFound = true
        document.getElementById('all').checked = false
    } else {
        for (let i = 0; i < data.length;) {
            const ele = document.getElementsByClassName(data[i].id)[0];
            if (ele.checked) {
                data = data.filter(item => item.id != data[i].id)
                selectedFound = true;
            } else {
                i++
            }
        }
    }
    updateInitialy()
    if (!selectedFound) {
        alert("Select any row")
    } else {
        forEdit = 0
        editId = 0
    }
})


refresh.addEventListener('click', () => {
    count = 1
    getData()
})


function createItem() {
    document.getElementById("addItem").style.display = "flex"
}

const clearAddItemField = () => {
    document.getElementById('chemicalNameNew').value = ""
    document.getElementById('venderNew').value = ""
    document.getElementById('densityNew').value = ""
    document.getElementById('viscosityNew').value = ""
    document.getElementById('packagingNew').value = ""
    document.getElementById('packSizeNew').value = ""
    document.getElementById('unitNew').value = ""
    document.getElementById('quantityNew').value = ""
}

const closeUpdate = () => {
    document.getElementById('addItemHeading').innerText = "Add Item"
    document.getElementById('saveItem').innerText = "Add"
}

function saveItem() {
    let v1 = document.getElementById('chemicalNameNew').value
    let v2 = document.getElementById('venderNew').value
    let v3 = document.getElementById('densityNew').value
    let v4 = document.getElementById('viscosityNew').value
    let v5 = document.getElementById('packagingNew').value
    let v6 = document.getElementById('packSizeNew').value
    let v7 = document.getElementById('unitNew').value
    let v8 = document.getElementById('quantityNew').value
    if (v1 && v2 && v3 && v4 && v7 && v8) {
        newObj = {
            "id": editId != 0 ? editId : count,
            "chemicalName": v1,
            "vendor": v2,
            "density": v3,
            "viscosity": v4,
            "packaging": v5 ? v5 : "N/A",
            "packSize": v6 ? v6 : "N/A",
            "unit": v7,
            "quantity": v8
        }
        editId != 0 ? data[editId - 1] = newObj : data.push(newObj)
        updateInitialy()
        document.getElementById("addItem").style.display = "none"
        editId != 0 ? closeUpdate() : null
        clearAddItemField()
    } else {
        alert("Fill all the data")
    }
}

function cancleSave() {
    document.getElementById("addItem").style.display = "none"
    clearAddItemField()
}

function EditData() {
    if (forEdit != 1) {
        alert("Select any one row edit")
    } else {
        console.log(editId)
        console.log(data[editId - 1])
        document.getElementById("addItem").style.display = "flex"
        document.getElementById('addItemHeading').innerText = "Update Item"
        document.getElementById('saveItem').innerText = "Update"

        document.getElementById('chemicalNameNew').value = data[editId - 1].chemicalName
        document.getElementById('venderNew').value = data[editId - 1].vendor
        document.getElementById('densityNew').value = data[editId - 1].density
        document.getElementById('viscosityNew').value = data[editId - 1].viscosity
        document.getElementById('packagingNew').value = data[editId - 1].packaging
        document.getElementById('packSizeNew').value = data[editId - 1].packSize
        document.getElementById('unitNew').value = data[editId - 1].unit
        document.getElementById('quantityNew').value = data[editId - 1].quantity
    }
}

function saveData() {
    alert("Data save successful")
}


function goDown() {
    if (forEdit == 1 && editId < count - 1) {
        temp = data[editId - 1]
        data[editId - 1] = data[editId]
        data[editId] = temp
        updateInitialy()
        forEdit = 0
        editId = 0
    }
}

function goUp() {
    if (forEdit == 1 && editId > 1) {
        temp = data[editId - 2]
        data[editId - 2] = data[editId - 1]
        data[editId - 1] = temp
        updateInitialy()
        forEdit = 0
        editId = 0
    }
}
