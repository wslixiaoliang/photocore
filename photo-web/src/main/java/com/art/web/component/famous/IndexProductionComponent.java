/*
 * Copyright (c) 1989-2020 Wslixiaoliang@Searching.Co.Ltd. All rights reserved.
 */

package com.art.web.component.famous;

import com.alibaba.dubbo.config.annotation.Reference;
import com.art.beans.elastic.SearchResult;
import com.art.beans.famous.FamousProduction;
import com.art.service.famous.IFamousProductionSV;
import com.art.util.DateUtil;
import com.art.util.SearchConstans;
import com.art.util.StringUtil;
import com.art.web.component.elastic.IndexComponent;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class IndexProductionComponent {

    @Autowired
    private IndexComponent indexComponent;
    @Reference
    private IFamousProductionSV famousProductionSV;
    private static final Logger LOGGER = Logger.getLogger(IndexProductionComponent.class);
    private static int count = 0;

    public SearchResult productionIndex(List<String> famousList)
    {
        SearchResult searchResult = new SearchResult();
        List<FamousProduction>  productionList = this.getProductions( famousList);
        if(null!=productionList && !productionList.isEmpty()){
            List<Map<String,Object>> documents = this.cfgIndexColumn(productionList);
            if(null!=documents && !documents.isEmpty()){
                for(Map<String,Object> document:documents){
                    String id = String.valueOf(document.get(SearchConstans.Production.PRODUCTION_ID));
                    try {
                        searchResult = indexComponent.createOrUpdating(SearchConstans.Production.INDEX_NAME, SearchConstans.Production.INDEX_TYPE,id,document);
                        if(null!=searchResult && SearchConstans.SUCESSS_RETURN_CODE.equals(String.valueOf(searchResult.getReturnCode()))){
                            count++;
                            searchResult.setTotalCount(count);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                        LOGGER.error("新增失败……"+e);
                    }
                }
            }
        }
        return searchResult;
    }

    /**
     * 获取数据库：产品信息List
     * @param famousList
     * @return
     */
    private List<FamousProduction> getProductions(List<String> famousList)
    {
        List<FamousProduction> productionList = new ArrayList<>();
        Map<String,Object> param = new HashMap<>();
        param.put("famousList",famousList);
        try{
            productionList = famousProductionSV.getProductionById(param);


        }catch(Exception e){
            LOGGER.error(e);
        }
        return productionList;
    }

    /**
     * 组装Document
     * @param productionList
     * @return
     */
    private List<Map<String,Object>> cfgIndexColumn(List<FamousProduction> productionList)
    {
        List<Map<String,Object>> documents = new ArrayList<>();
        if(null==productionList && productionList.isEmpty()){
            return documents;
        }
        for(FamousProduction production:productionList)
        {
            Map<String,Object> document = new HashMap<>();
            document.put(SearchConstans.Production.PRODUCTION_ID, StringUtil.isNotEmpty(String.valueOf(production.getProductionId()))?String.valueOf(production.getProductionId()):"");
            document.put(SearchConstans.Production.FAMOUS_ID, StringUtil.isNotEmpty(String.valueOf(production.getFamousId()))?String.valueOf(production.getFamousId()):"");
            document.put(SearchConstans.Production.PORTRAIT_NAME, StringUtil.isNotEmpty(String.valueOf(production.getPortraitName()))?String.valueOf(production.getPortraitName()):"");
            document.put(SearchConstans.Production.CHINESE_NAME, StringUtil.isNotEmpty(String.valueOf(production.getChineseName()))?String.valueOf(production.getChineseName()):"");
            document.put(SearchConstans.Production.ENGLISH_NAME, StringUtil.isNotEmpty(String.valueOf(production.getEnglishName()))?String.valueOf(production.getEnglishName()):"");
            document.put(SearchConstans.Production.CREATE_TIME, DateUtil.getCurrentTime("yyyy-MM-dd HH:mm:ss"));
            document.put(SearchConstans.Production.PRODUCTION_NAME, StringUtil.isNotEmpty(String.valueOf(production.getProductionName()))?String.valueOf(production.getProductionName()):"");
            document.put(SearchConstans.Production.PUBLISHED_YEAR, StringUtil.isNotEmpty(String.valueOf(production.getPublishedYear()))?String.valueOf(production.getPublishedYear()):"");
            document.put(SearchConstans.Production.SUMMARY_INFO, StringUtil.isNotEmpty(String.valueOf(production.getSummaryInfo()))?String.valueOf(production.getSummaryInfo()):"");
            document.put(SearchConstans.Production.PRODUCTION_CNTT, StringUtil.isNotEmpty(String.valueOf(production.getProductionContent()))?String.valueOf(production.getProductionContent()):"");
            documents.add(document);
        }
        return documents;
    }
}
