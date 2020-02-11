package com.systemobslugibazydanych.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class FeedbackDTO {

    private ArrayList<String> lista;
    private List<Map<String,Object>> mapa;
    private boolean updateFlag;

    public FeedbackDTO(ArrayList<String> lista, List<Map<String, Object>> mapa, boolean updateFlag) {
        this.lista = lista;
        this.mapa = mapa;
        this.updateFlag = updateFlag;
    }

    public ArrayList<String> getLista() {
        return lista;
    }

    public void setLista(ArrayList<String> lista) {
        this.lista = lista;
    }

    public List<Map<String, Object>> getMapa() {
        return mapa;
    }

    public void setMapa(List<Map<String, Object>> mapa) {
        this.mapa = mapa;
    }

    public boolean isUpdateFlag() {
        return updateFlag;
    }

    public void setUpdateFlag(boolean updateFlag) {
        this.updateFlag = updateFlag;
    }

}