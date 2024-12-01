/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import { getDatas } from '../FetchingData'
import { Loading } from '../Loading'
import 'chart.js/auto'
ChartJS.register(ArcElement, Tooltip, Legend)
// Definimos el tipo para los datos del cliente

const options = {
  responsive: true,
  maintainAspectRatio: false
}

const optionsEdad = {
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const deepCopy = (obj: any): any => JSON.parse(JSON.stringify(obj))

export default function LinesChart (): JSX.Element {
  const [clientes, setClientes] = useState<never[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [data, setData] = useState<any>(null)
  const [dataEdad, setDataEdad] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Cantidad de Personas por Rango de Edad',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }
    ]
  })
  const [dataGenero, setDataGenero] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Cantidad de Personas por Genero',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }
    ]
  })

  const optionsGenero: ChartOptions = deepCopy({
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (index: number) => {
            const genero: string = dataGenero.labels[index]
            const cantidadPersonas: string = dataGenero.datasets[0].data[index]
            return `${genero}: ${cantidadPersonas}`
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false // Oculta la leyenda (ya que usamos las etiquetas personalizadas en el eje Y)
      },
      title: {
        display: false // Oculta el título del gráfico
      }
    }
    // Aquí puedes configurar otras opciones adicionales del gráfico, si lo deseas.
  })

  const [dataDepartamentosFiltrados, setDataDepartamentosFiltrados] =
    useState<any>(null)
  const [dataDistritosFiltrados, setDataDistritosFiltrados] =
    useState<any>(null)
  const [paisSeleccionado, setPaisSeleccionado] = useState('')
  const [paises, setPaises] = useState<any>(null)
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('')
  const [distritoSeleccionado, setDistritoSeleccionado] = useState('')

  useEffect(() => {
    Promise.all([getDatas('indexToVentas', setClientes, setTotalRegistros)])
      .then(() => {
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    todosPaises()
    todasLasEdades()
  }, [clientes])

  // FUNCIONES PARA GENERAR GRAFICAS

  const todosPaises = (): void => {
    if (clientes.length > 0) {
      const countByCountry: Record<string, number> = {}

      clientes.forEach((cliente: { region: string }) => {
        const clienteObj = JSON.parse(cliente.region)
        if (!clienteObj) {
          return
        }
        const country = clienteObj.country

        if (country) {
          if (countByCountry[country]) {
            countByCountry[country]++
          } else {
            countByCountry[country] = 1
          }
        }
      })

      const totalClientes = Object.values(countByCountry).reduce(
        (total, count) => total + count,
        0
      )
      setTotalRegistros(totalClientes)

      const chartData = {
        labels: Object.keys(countByCountry),
        datasets: [
          {
            label: 'Cantidad de Personas por País',
            data: Object.values(countByCountry),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }
        ]
      }

      setDepartamentoSeleccionado('')
      setDistritoSeleccionado('')
      setData(chartData)
      setPaises(chartData)
    }
  }

  useEffect(() => {
    if (clientes.length > 0 && paisSeleccionado) {
      const fetchDepartmentData = async (): Promise<void> => {
        const countByDepartment: Record<string, number> = {}

        const promises = clientes.map(async (cliente: { region: string }) => {
          const clienteObj = JSON.parse(cliente.region)
          if (!clienteObj) {
            return
          }
          const department = clienteObj.department

          if (paisSeleccionado && clienteObj.country !== paisSeleccionado) {
            return
          }

          if (department) {
            if (countByDepartment[department]) {
              countByDepartment[department]++
            } else {
              countByDepartment[department] = 1
            }
          }
        })

        await Promise.all(promises)

        if (paisSeleccionado) {
          const totalClientes = Object.values(countByDepartment).reduce(
            (total, count) => total + count,
            0
          )
          setTotalRegistros(totalClientes)
        }

        const chartData = {
          labels: Object.keys(countByDepartment),
          datasets: [
            {
              label: 'Cantidad de Personas por Departamento',
              data: Object.values(countByDepartment),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
            }
          ]
        }

        setData(chartData)
        setDataDepartamentosFiltrados(chartData)
      }

      fetchDepartmentData()
    }
    if (clientes.length > 0 && paisSeleccionado) {
      const fetchCountryData = async (): Promise<void> => {
        const countByAgeRange: Record<string, number> = {
          '11-20': 0,
          '21-30': 0,
          '31-40': 0,
          '41-50': 0,
          '51+': 0
        }

        const promises = clientes.map(
          async (cliente: { region: string, edad: number }) => {
            const clienteObj = JSON.parse(cliente.region)
            if (!clienteObj) {
              return
            }
            const country = clienteObj.country

            if (!country) {
              return
            }

            if (paisSeleccionado && country !== paisSeleccionado) {
              return
            }

            const edad = cliente.edad

            // Aquí debes implementar la lógica para clasificar la edad en rangos y contarlas
            if (edad >= 11 && edad <= 20) {
              countByAgeRange['11-20']++
            } else if (edad >= 21 && edad <= 30) {
              countByAgeRange['21-30']++
            } else if (edad >= 31 && edad <= 40) {
              countByAgeRange['31-40']++
            } else if (edad >= 41 && edad <= 50) {
              countByAgeRange['41-50']++
            } else if (edad >= 51) {
              countByAgeRange['51+']++
            }
          }
        )

        await Promise.all(promises)

        const sortedKeys = Object.keys(countByAgeRange)
        const sortedData = sortedKeys.map((key) => countByAgeRange[key])

        const chartData = {
          labels: sortedKeys,
          datasets: [
            {
              label: 'Cantidad de Personas por Rango de Edad',
              data: sortedData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        }

        if (paisSeleccionado) {
          setDataEdad(chartData)
        }
      }

      fetchCountryData()
    }

    if (clientes.length > 0 && paisSeleccionado) {
      const fetchCountryData = async (): Promise<void> => {
        const countByGender: Record<string, number> = {
          Hombres: 0,
          Mujeres: 0,
          Otros: 0
        }

        const promises = clientes.map(
          async (cliente: { region: string, edad: number, sexo: string }) => {
            const clienteObj = JSON.parse(cliente.region)
            if (!clienteObj) {
              return
            }
            const country = clienteObj.country

            if (!country) {
              return
            }

            if (paisSeleccionado && country !== paisSeleccionado) {
              return
            }

            const sexo = cliente.sexo

            // Aquí debes implementar la lógica para contar la cantidad de personas por género
            if (sexo == 'hombre') {
              countByGender.Hombres++
            } else if (sexo == 'mujer') {
              countByGender.Mujeres++
            } else {
              countByGender.Otros++
            }
          }
        )

        await Promise.all(promises)

        const sortedKeys = Object.keys(countByGender)
        const sortedData = sortedKeys.map((key) => countByGender[key])

        const chartData = {
          labels: sortedKeys,
          datasets: [
            {
              label: 'Cantidad de Personas por Género',
              data: sortedData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)'
              ],
              borderWidth: 1
            }
          ]
        }

        if (paisSeleccionado) {
          setDataGenero(chartData)
        }
      }

      fetchCountryData()
    }
  }, [paisSeleccionado])

  useEffect(() => {
    if (clientes.length > 0 && departamentoSeleccionado) {
      const fetchDistrictData = async (): Promise<void> => {
        const countByDistrict: Record<string, number> = {}

        const promises = clientes.map(async (cliente: { region: string }) => {
          const clienteObj = JSON.parse(cliente.region)
          if (!clienteObj || clienteObj === null) {
            return
          }
          const department = clienteObj.department
          const district = clienteObj.district

          if (!department || !district) {
            return
          }

          if (department !== departamentoSeleccionado) {
            return
          }

          if (countByDistrict[district]) {
            countByDistrict[district]++
          } else {
            countByDistrict[district] = 1
          }
        })

        await Promise.all(promises)

        if (departamentoSeleccionado) {
          const totalClientes = Object.values(countByDistrict).reduce(
            (total, count) => total + count,
            0
          )
          setTotalRegistros(totalClientes)
        }

        const chartData = {
          labels: Object.keys(countByDistrict),
          datasets: [
            {
              label: 'Cantidad de Personas por Distrito',
              data: Object.values(countByDistrict),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
            }
          ]
        }

        setDataDistritosFiltrados(chartData)
        setData(chartData)
      }

      fetchDistrictData()
    }
  }, [departamentoSeleccionado])

  const todosDepartamentos = (): void => {
    if (clientes.length > 0) {
      const fetchDistrictData = async (): Promise<void> => {
        const countByDistrict: Record<string, number> = {}

        clientes.forEach((cliente: { region: string }) => {
          const clienteObj = JSON.parse(cliente.region)
          if (!clienteObj) {
            return
          }
          const country = clienteObj.country
          const department = clienteObj.department

          if (!country || !department) {
            return
          }

          if (country !== paisSeleccionado) {
            return
          }

          if (countByDistrict[department]) {
            countByDistrict[department]++
          } else {
            countByDistrict[department] = 1
          }
        })

        const totalClientes = Object.values(countByDistrict).reduce(
          (total, count) => total + count,
          0
        )
        setTotalRegistros(totalClientes)

        const chartData = {
          labels: Object.keys(countByDistrict),
          datasets: [
            {
              label: 'Cantidad de Personas por Distrito',
              data: Object.values(countByDistrict),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
            }
          ]
        }

        setData(chartData)
        setDepartamentoSeleccionado('')
        setDistritoSeleccionado('')
      }

      fetchDistrictData()
    }
  }

  useEffect(() => {
    if (clientes.length > 0 && distritoSeleccionado) {
      const fetchDistrictData = async (): Promise<void> => {
        const countByDistrict: Record<string, number> = {}

        clientes.forEach((cliente: { region: string }) => {
          const clienteObj = JSON.parse(cliente.region)
          if (!clienteObj) {
            return
          }
          const department = clienteObj.department
          const district = clienteObj.district

          if (!department || !district) {
            return
          }

          if (department !== departamentoSeleccionado) {
            return
          }

          if (district !== distritoSeleccionado) {
            return
          }

          if (countByDistrict[district]) {
            countByDistrict[district]++
          } else {
            countByDistrict[district] = 1
          }
        })

        if (distritoSeleccionado) {
          const totalClientes = Object.values(countByDistrict).reduce(
            (total, count) => total + count,
            0
          )
          setTotalRegistros(totalClientes)
        }

        const chartData = {
          labels: Object.keys(countByDistrict),
          datasets: [
            {
              label: 'Cantidad de Personas por Distrito',
              data: Object.values(countByDistrict),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
            }
          ]
        }

        setData(chartData)
      }

      fetchDistrictData()
    }
  }, [distritoSeleccionado])

  const todosDistritos = (): void => {
    if (clientes.length > 0 && departamentoSeleccionado) {
      const fetchDistrictData = async (): Promise<void> => {
        const countByDistrict: Record<string, number> = {}

        clientes.forEach((cliente: { region: string }) => {
          const clienteObj = JSON.parse(cliente.region)
          if (!clienteObj) {
            return
          }
          const department = clienteObj.department
          const district = clienteObj.district

          if (!department || !district) {
            return
          }

          if (department !== departamentoSeleccionado) {
            return
          }

          if (countByDistrict[district]) {
            countByDistrict[district]++
          } else {
            countByDistrict[district] = 1
          }
        })

        if (departamentoSeleccionado) {
          const totalClientes = Object.values(countByDistrict).reduce(
            (total, count) => total + count,
            0
          )
          setTotalRegistros(totalClientes)
        }

        const chartData = {
          labels: Object.keys(countByDistrict),
          datasets: [
            {
              label: 'Cantidad de Personas por Distrito',
              data: Object.values(countByDistrict),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
              ],
              borderWidth: 1
            }
          ]
        }

        setData(chartData)
      }

      fetchDistrictData()
    }
  }

  // METRICAS PARA EDADES

  useEffect(() => {
    if (clientes.length > 0 && departamentoSeleccionado) {
      const fetchDistrictData = async (): Promise<void> => {
        const countByAgeRange: Record<string, number> = {
          '11-20': 0,
          '21-30': 0,
          '31-40': 0,
          '41-50': 0,
          '51+': 0
        }

        const promises = clientes.map(
          async (cliente: { region: string, edad: number }) => {
            const clienteObj = JSON.parse(cliente.region)
            if (!clienteObj) {
              return
            }
            const department = clienteObj.department

            if (!department) {
              return
            }

            if (department !== departamentoSeleccionado) {
              return
            }

            const edad = cliente.edad

            // Aquí debes implementar la lógica para clasificar la edad en rangos y contarlas
            if (edad >= 11 && edad <= 20) {
              countByAgeRange['11-20']++
            } else if (edad >= 21 && edad <= 30) {
              countByAgeRange['21-30']++
            } else if (edad >= 31 && edad <= 40) {
              countByAgeRange['31-40']++
            } else if (edad >= 41 && edad <= 50) {
              countByAgeRange['41-50']++
            } else if (edad >= 51) {
              countByAgeRange['51+']++
            }
          }
        )

        await Promise.all(promises)

        const sortedKeys = Object.keys(countByAgeRange)
        const sortedData = sortedKeys.map((key) => countByAgeRange[key])

        const chartData = {
          labels: sortedKeys,
          datasets: [
            {
              label: 'Cantidad de Personas por Rango de Edad',
              data: sortedData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        }

        if (departamentoSeleccionado) {
          setDataEdad(chartData)
        }
      }

      fetchDistrictData()
    }
  }, [departamentoSeleccionado])

  useEffect(() => {
    if (clientes.length > 0 && distritoSeleccionado) {
      const fetchDistrictData = async (): Promise<void> => {
        const countByAgeRange: Record<string, number> = {
          '11-20': 0,
          '21-30': 0,
          '31-40': 0,
          '41-50': 0,
          '51+': 0
        }

        const promises = clientes.map(
          async (cliente: { region: string, edad: number }) => {
            const clienteObj = JSON.parse(cliente.region)
            if (!clienteObj) {
              return
            }
            const district = clienteObj.district

            if (!district) {
              return
            }

            if (district !== distritoSeleccionado) {
              return
            }

            const edad = cliente.edad

            // Aquí debes implementar la lógica para clasificar la edad en rangos y contarlas
            if (edad >= 11 && edad <= 20) {
              countByAgeRange['11-20']++
            } else if (edad >= 21 && edad <= 30) {
              countByAgeRange['21-30']++
            } else if (edad >= 31 && edad <= 40) {
              countByAgeRange['31-40']++
            } else if (edad >= 41 && edad <= 50) {
              countByAgeRange['41-50']++
            } else if (edad >= 51) {
              countByAgeRange['51+']++
            }
          }
        )

        await Promise.all(promises)

        const sortedKeys = Object.keys(countByAgeRange)
        const sortedData = sortedKeys.map((key) => countByAgeRange[key])

        const chartData = {
          labels: sortedKeys,
          datasets: [
            {
              label: 'Cantidad de Personas por Rango de Edad',
              data: sortedData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        }

        if (departamentoSeleccionado) {
          setDataEdad(chartData)
        }
      }

      fetchDistrictData()
    }
  }, [distritoSeleccionado])

  const todasLasEdades = (): void => {
    if (clientes.length > 0) {
      const countByAgeRange: Record<string, number> = {
        '11-20': 0,
        '21-30': 0,
        '31-40': 0,
        '41-50': 0,
        '51+': 0
      }

      clientes.forEach((cliente: { region?: string, edad: number }) => {
        if (!cliente.region) {
          return // Si el cliente no tiene ubicación, omitirlo
        }

        const clienteObj = JSON.parse(cliente.region)
        if (!clienteObj) {
          return // Si no se puede parsear la ubicación, omitirlo
        }
        const edad = cliente.edad
        if (edad >= 11 && edad <= 20) {
          countByAgeRange['11-20']++
        } else if (edad >= 21 && edad <= 30) {
          countByAgeRange['21-30']++
        } else if (edad >= 31 && edad <= 40) {
          countByAgeRange['31-40']++
        } else if (edad >= 41 && edad <= 50) {
          countByAgeRange['41-50']++
        } else if (edad >= 51) {
          countByAgeRange['51+']++
        }
      })

      const sortedKeys = Object.keys(countByAgeRange)
      const sortedData = sortedKeys.map((key) => countByAgeRange[key])

      const chartData = {
        labels: sortedKeys,
        datasets: [
          {
            label: 'Cantidad de Personas por Rango de Edad',
            data: sortedData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      }

      setDataEdad(chartData)
    }
  }

  const todosDepartamentosporEdad = (): void => {
    if (clientes.length > 0 && paisSeleccionado) {
      const countByAgeRange: Record<string, number> = {
        '11-20': 0,
        '21-30': 0,
        '31-40': 0,
        '41-50': 0,
        '51+': 0
      }

      clientes.forEach((cliente: { region: string, edad: number }) => {
        const clienteObj = JSON.parse(cliente.region)
        if (!clienteObj) {
          return
        }
        const country = clienteObj.country

        if (country !== paisSeleccionado) {
          return
        }

        const edad = cliente.edad

        // Aquí debes implementar la lógica para clasificar la edad en rangos y contarlas
        if (edad >= 11 && edad <= 20) {
          countByAgeRange['11-20']++
        } else if (edad >= 21 && edad <= 30) {
          countByAgeRange['21-30']++
        } else if (edad >= 31 && edad <= 40) {
          countByAgeRange['31-40']++
        } else if (edad >= 41 && edad <= 50) {
          countByAgeRange['41-50']++
        } else if (edad >= 51) {
          countByAgeRange['51+']++
        }
      })

      const sortedKeys = Object.keys(countByAgeRange)
      const sortedData = sortedKeys.map((key) => countByAgeRange[key])

      const chartData = {
        labels: sortedKeys,
        datasets: [
          {
            label: 'Cantidad de Personas por Rango de Edad',
            data: sortedData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      }

      setDataEdad(chartData)
    }
  }

  const todosDistritosporEdad = (): void => {
    if (clientes.length > 0 && departamentoSeleccionado) {
      const fetchDistrictData = async (): Promise<void> => {
        const countByAgeRange: Record<string, number> = {
          '11-20': 0,
          '21-30': 0,
          '31-40': 0,
          '41-50': 0,
          '51+': 0
        }
        clientes.forEach((cliente: { region: string, edad: number }) => {
          const clienteObj = JSON.parse(cliente.region)
          if (!clienteObj) {
            return
          }

          const department = clienteObj.department
          if (department !== departamentoSeleccionado) {
            return
          }

          const district = clienteObj.district
          if (!district) {
            return
          }

          const edad = cliente.edad

          if (edad >= 11 && edad <= 20) {
            countByAgeRange['11-20']++
          } else if (edad >= 21 && edad <= 30) {
            countByAgeRange['21-30']++
          } else if (edad >= 31 && edad <= 40) {
            countByAgeRange['31-40']++
          } else if (edad >= 41 && edad <= 50) {
            countByAgeRange['41-50']++
          } else if (edad >= 51) {
            countByAgeRange['51+']++
          }
        })

        const sortedKeys = Object.keys(countByAgeRange)
        const sortedData = sortedKeys.map((key) => countByAgeRange[key])

        const chartData = {
          labels: sortedKeys,
          datasets: [
            {
              label: 'Cantidad de Personas por Rango de Edad',
              data: sortedData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        }

        setDataEdad(chartData)
      }

      fetchDistrictData()
    }
  }

  return (
    <div className="text-black w-full flex flex-col justify-center items-center">
      {loading && <Loading />}

      <section className="absolute left-2 top-2 flex justify-between items-center section_metricas">
        <div className="flex gap-3 px-2 w-full">
          <select
            value={paisSeleccionado}
            onChange={(e) => {
              const selectedValue: any = e.target.value
              setPaisSeleccionado(selectedValue !== '' && selectedValue)
              if (selectedValue == '') {
                todosPaises()
                todasLasEdades()
              }
            }}
            className="text-left w-fit rounded-lg outline-none py-2 px-2 bg-main text-white font-bold"
          >
            <option value="">Todos los paises</option>
            {paises
              ? paises.labels.map((label: any, index: number) => (
                  <option value={label} key={index}>
                    {label}
                  </option>
              ))
              : ''}
          </select>
          {paisSeleccionado && (
            <select
              value={departamentoSeleccionado}
              onChange={(e) => {
                const selectedValue: any = e.target.value
                setDepartamentoSeleccionado(
                  selectedValue !== '' && selectedValue
                )
                if (selectedValue == '') {
                  todosDepartamentos()
                  todosDepartamentosporEdad()
                }
              }}
              className="text-left w-fit rounded-lg outline-none py-2 px-2 bg-[#CDDBFE]"
            >
              <option value="">Todos los departamentos</option>
              {dataDepartamentosFiltrados
                ? dataDepartamentosFiltrados.labels.map(
                  (label: any, index: number) => (
                      <option value={label} key={index}>
                        {label}
                      </option>
                  )
                )
                : ''}
            </select>
          )}

          {paisSeleccionado && departamentoSeleccionado && (
            <select
              value={distritoSeleccionado}
              onChange={(e) => {
                const selectedValue: any = e.target.value
                setDistritoSeleccionado(selectedValue !== '' && selectedValue)
                if (selectedValue == '') {
                  todosDistritos()
                  todosDistritosporEdad()
                }
              }}
              className="text-left w-fit rounded-lg outline-none py-2"
            >
              <option value="">Todos los distritos</option>
              {dataDistritosFiltrados
                ? dataDistritosFiltrados.labels.map(
                  (label: any, index: number) => (
                      <option value={label} key={index}>
                        {label}
                      </option>
                  )
                )
                : ''}
            </select>
          )}
        </div>

        <p className="text-black font-bold text-xl block w-full right-0">
          {totalRegistros} REGISTROS
        </p>
      </section>

      {data
        ? (
        <>
          <section className="flex flex-row justify-between items-center w-full h-full gap-4 px-4 py-4 mt-6">
            <div className="w-2/5 h-96 bg-white rounded-lg">
              <Pie
                data={data}
                options={options}
                className="m-auto p-4 object-contain graficaas"
              />
            </div>

            <div className="w-3/5 h-96 bg-white rounded-lg">
              <Bar
                data={dataEdad}
                options={optionsEdad}
                className="m-auto p-4 object-contain graficaas"
              />
            </div>
          </section>

          <section className="flex flex-row justify-between items-center w-full h-full gap-4 px-4 py-4">
            <div className="w-2/5 h-96 bg-white rounded-lg">

              <Bar data={dataGenero}
               // @ts-ignore
              options={optionsGenero} className="m-auto w-full h-full p-4 object-contain graficaas"/>
            </div>

            <div className="w-3/5 h-96 bg-white rounded-lg">
              <Bar
                data={dataEdad}
                options={optionsEdad}
                className="w-full h-full m-auto p-4 object-contain"
              />
            </div>
          </section>
        </>
          )
        : (
            ''
          )}
    </div>
  )
}
