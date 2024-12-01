/* eslint-disable camelcase */
import { Global } from '@/helper/Global'
import { MetadataRoute } from 'next'

export default async function sitemap (): Promise<MetadataRoute.Sitemap> {
  const categoriesRes = await fetch(
    `${Global.url}/newsletter/getAllCategoriasPublic`,
    { cache: 'no-store' }
  )

  const productsRes = await fetch(
    `${Global.url}/newsletter/getAllArticulosPublic2`,
    { cache: 'no-store' }
  )
  const categories = await categoriesRes.json()
  const products = await productsRes.json()
  const categorias: MetadataRoute.Sitemap = categories.map(({ url }: any) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletter/${url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  }))
  const productos: MetadataRoute.Sitemap = products.map(
    ({ url, url_categoria }: any) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/newsletter/${url_categoria}/${url}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    })
  )
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/`, // URL principal
      lastModified: new Date(),
      priority: 1.0 // Alta prioridad para la página principal
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/diseno_grafico/casa-quimuk`,
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/desarrollo_web/padre_eterno`,
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/hosting/biociencia`,
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/community_manager/sisitravels`,
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/capacitaciones/corporacion_empaques`,
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/mixelito`,
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/nosotros`,
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio`,
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/terminologia`,
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/diseno_grafico/fama-de-quillabamba`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/desarrollo_web/medicina_academica`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/desarrollo_web/agua_kungu`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/hosting/mst_proyectos`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/community_manager/disa_ingenieros`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/community_manager/new_fest`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/capacitaciones/lordcru`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/diseno_grafico/plaza_san_antonio`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/diseno_grafico/moralitos`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/diseno_grafico/awasu`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/diseno_grafico/jackos_bar`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/desarrollo_web/fisiofast`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/desarrollo_web/rda`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/community_manager/acabados_zendy`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/capacitaciones/covercom_block`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/capacitaciones/centro_medico_oftalmologico`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/hosting/rda`,
      lastModified: new Date(),
      priority: 0.64
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/diseno_grafico/puerto_marino`,
      lastModified: new Date(),
      priority: 0.51
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/desarrollo_web/inacons`,
      lastModified: new Date(),
      priority: 0.51
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/community_manager/sesystec`,
      lastModified: new Date(),
      priority: 0.51
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/diseno_grafico/zertuming`,
      lastModified: new Date(),
      priority: 0.51
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/diseno_grafico/vilanova-sur`,
      lastModified: new Date(),
      priority: 0.41
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/portafolio/diseno_grafico/gasolineras_del_norte`,
      lastModified: new Date(),
      priority: 0.41
    },
    ...categorias,
    ...productos
  ]
}
